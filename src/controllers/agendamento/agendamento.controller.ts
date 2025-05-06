import { Request, Response } from 'express'
import Agendamento from '../../models/Agendamento'
import Usuario from '../../models/Usuario'
import Monitoria from '../../models/Monitoria'
import { diaDaSemana, TipoLocal } from '../../utils/validacoes'
import { Between, MoreThanOrEqual } from 'typeorm'
import Materia from '../../models/Materia'
//import axios from 'axios'

export default class AgendamentoController {
    static async store(req: Request, res: Response){
        const { data, idMonitoria, obs } = req.body
        const idUsuario = req.headers.userId

        const hoje = new Date()

        if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})

        if (usuario?.tipo == "Monitor") return res.status(403).json("Usuário não possui permissão de acesso")
        
        if(!idMonitoria || isNaN(Number(idMonitoria))) return res.status(401).json({ error: 'Monitoria inválida' })
				
        const monitoria = await Monitoria.findOne({
          where: { id: Number(idMonitoria) },
          relations: ['materia']
        })
        if (!monitoria) return res.status(400).json({error: 'Monitoria inválida'})
        
        if (!data) return res.status(400).json({error: 'Data deve ser preenchida!'})
          
        console.log("Data recebida:", data);
        const data2 = new Date(data)
        const diaSemana = diaDaSemana(data2)
        console.log(diaSemana)

        hoje.setHours(0,0,0,0)
        data2.setHours(0,0,0,0)
        
        
        if (data2 < hoje) {
          console.log('monitoria.dia_semana: ', monitoria.dia_semana)
          console.log('diaSemana: ', diaSemana)
          return res.status(401).json({ 
              error: "Data inválida: data anterior ao dia atual ou não corresponde ao dia da semana da monitoria", 
          })
        }

        if (usuario !== null)
        {
          const agendamentos = await Agendamento.find()
          const inicioDoDia = new Date(data2);
          inicioDoDia.setHours(0, 0, 0, 0);
          
          const fimDoDia = new Date(data2);
          fimDoDia.setHours(23, 59, 59, 999);
          
          data2.setHours(0, 0, 0, 0)
          console.log('Data recebida (ISO):', data2.toISOString());
          console.log('Data recebida (Local):', data2.toLocaleString());

          const agendamentoExistente = await Agendamento.findOne({
            where: {
              data: Between(inicioDoDia, fimDoDia),
              monitoria: { id: monitoria.id },
              usuario: { id: usuario.id }
            },
            relations: ['monitoria', 'usuario']
          })                    
          
        if (agendamentoExistente) {
          return res.status(409).json("Usuário já está agendado para esta monitoria no mesmo dia.");
        }

          const agendamento = new Agendamento()
          agendamento.data = data
          agendamento.monitoria = monitoria
          agendamento.observacao = obs
          agendamento.usuario = usuario

          await agendamento.save()
          console.log("Agendamento realizado!",
            {id: agendamento.id,
              data: agendamento.data,
              usuario: { id: usuario.id, nome: usuario.nome },
              monitoria: { id: monitoria.id, materia: monitoria.materia.nome },
              observacao: agendamento.observacao})
        
          return res.status(201).json({
            id: agendamento.id,
            data: agendamento.data,
            usuario: { id: usuario.id, nome: usuario.nome },
            monitoria: { id: monitoria.id, materia: monitoria.materia.nome },
            observacao: agendamento.observacao
          })

        }
        return res.json('Erro com usuário')
    }
    
    /*static async dataAgendamento (req: Request, res: Response){
      const idUsuario = req.headers.userId

      if (!idUsuario) res.status(401).json({ error: 'Usuário não autenticado' })
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno") res.status(403).json("Usuário não possui permissão de acesso")
      
      if (usuario !== null)
      {  
        const agendamentos = await Agendamento.find({ where: { 
          usuario: usuario, 
          data: MoreThan(new Date()) 
        },
          order: {data: 'ASC'}
      })
      const datas = agendamentos.map(agendamento => agendamento.data)
      return res.json(datas)
      }
      else res.json('Erro com usuário')
    }*/
   
    static async showAluno (req: Request, res: Response){
		    const idUsuario = req.headers.userId

        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })
        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario !== null){
        
        //exibição para usuário aluno
        if (usuario?.tipo == "Aluno"){        

          console.log("Consulta: agendamentos - Aluno")
          const agendamentos = await Agendamento.find({ where: { 
            usuario: usuario, 
           // data: MoreThanOrEqual(hoje)
          },
            order: {data: 'ASC'},
            relations: ['monitoria']
        } )

      let local: string, materia: string
      async function dados(agendamento: Agendamento) {
        const monitoria = await Monitoria.findOne({
          where: { id: agendamento.monitoria.id },
          relations: ['materia', 'local', 'usuario']
        })
      
        if (!monitoria) return res.status(404).json({ error: "Monitoria não encontrada" })
      
        agendamento.monitoria = monitoria
      
        local = monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : monitoria.local.tipo
        materia = monitoria.materia.nome
      }

          const resultado = await Promise.all(agendamentos.map(async (agendamento) => {
            await dados(agendamento)

            return {
                id: agendamento.id,
                local,
                materia,
                data: agendamento.data,
                obs: agendamento.observacao,
                dia_semana: agendamento.monitoria?.dia_semana || '',
                horario: `${agendamento.monitoria?.horario_inicio} - ${agendamento.monitoria?.horario_fim}`,
                idMonitoria: agendamento.monitoria?.id,
                idFotoMateria: agendamento.monitoria?.materia?.idFoto,
                idFotoMonitor: agendamento.monitoria?.usuario?.idFoto,
                monitor: agendamento.monitoria?.usuario?.nome
            }
        }))
        return res.status(200).json(resultado)
        }
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
      }}

    static async showAlunoDate (req: Request, res: Response){
      const idUsuario = req.headers.userId
      const { data } = req.body
      
      if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })
      const usuario = await Usuario.findOneBy({id: Number(idUsuario)})

      if (!data) return res.status(400).json("Data deve ser informada")
      
      var aDate = new Date(data).toISOString().split('T')[0]

      if (usuario !== null){
      
      //exibição para usuário aluno
      if (usuario?.tipo == "Aluno"){        

        console.log("Consulta: agendamentos - Aluno")
        const agendamentos = await Agendamento.find({ where: { 
          usuario: usuario,
          //data: MoreThanOrEqual(hoje)
        },
          order: {data: 'ASC'},
          relations: ['monitoria']
      } )

    let local: string, materia: string
    async function dados(agendamento: Agendamento) {
      const monitoria = await Monitoria.findOne({
        where: { id: agendamento.monitoria.id },
        relations: ['materia', 'local', 'usuario']
      })
    
      if (!monitoria) return res.status(404).json({ error: "Monitoria não encontrada" })
    
      agendamento.monitoria = monitoria
    
      local = monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : monitoria.local.tipo
      materia = monitoria.materia.nome
    }

    const agendamentosFiltrados = agendamentos.filter(
      (a) => a.data.toISOString().split('T')[0] === aDate
    )

        const resultado = await Promise.all(agendamentosFiltrados.map(async (agendamento) => {
          if (agendamento.data.toISOString().split('T')[0] == aDate){
          await dados(agendamento)

          return {
              id: agendamento.id,
              local,
              materia,
              data: agendamento.data,
              obs: agendamento.observacao,
              dia_semana: agendamento.monitoria?.dia_semana || '',
              horario: `${agendamento.monitoria?.horario_inicio} - ${agendamento.monitoria?.horario_fim}`,
              idMonitoria: agendamento.monitoria?.id,
              idFotoMateria: agendamento.monitoria?.materia?.idFoto,
              idFotoMonitor: agendamento.monitoria?.usuario?.idFoto,
              monitor: agendamento.monitoria?.usuario?.nome
          }
      }
      else { return null }
      }))
      console.log("resultado aluno", resultado)
      return res.status(200).json(resultado)
      }
      return res.status(400).json({ error: 'Tipo de usuário inválido' })
    }}

    static async showMonitor (req: Request, res: Response){
      const idUsuario = req.headers.userId

      if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })
      const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
      if (usuario !== null){
      //exibição para usuário monitor
      if (usuario?.tipo == "Monitor") {

      //encontrar as monitorias deste monitor para dps poder retornar os agendamentos delas
        const monitorias = await Monitoria.find({
          where: { usuario: usuario },
          relations: ['agendamentos', 'local', 'materia', 'usuario'] 
          })

      //contagem de agendamentos associados a essa monitoria
          const contagemAlunos = new Map<number, Map<string, number>>()
          monitorias.forEach(monitoria => {
          
          if (!contagemAlunos.has(monitoria.id)) {
            contagemAlunos.set(monitoria.id, new Map<string, number>())
          }
        
          const dataContagem = contagemAlunos.get(monitoria.id)!
          monitoria.agendamentos.forEach(agendamento => {

            console.log("Agendamentodata ", new Date (agendamento.data))
              const dataConv = agendamento.data.toISOString().split('T')[0]
              const count = dataContagem.get(dataConv) || 0
              dataContagem.set(dataConv, count + 1)
              console.log("data contagem e dataconv", dataContagem, dataConv)
          })
      })
        console.log("Consulta: agendamentos - Monitor")
      
        const resultado = monitorias.flatMap(monitoria => 
          monitoria.agendamentos.map(agendamento => {
            const dataConv = agendamento.data.toISOString().split('T')[0]
            const quantidadeAluno = contagemAlunos.get(monitoria.id)?.get(dataConv) || 0
            return {
              local: monitoria.local 
                  ? (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`) 
                  : '',
              quantidadeAluno,
              data: agendamento.data,
              obs: agendamento.observacao,
              dia_semana: monitoria.dia_semana || '',
              horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
              idMonitoria: monitoria.id,
              idFotoMateria: monitoria.materia.idFoto ?? '1',
              id: agendamento.id,
              materia: monitoria.materia?.nome,
          }
        })
      )
      const resultadoOrdenado = resultado.sort((a, b) => a.data.getTime() - b.data.getTime())
      return res.status(200).json(resultadoOrdenado)
      }
      return res.status(400).json({ error: 'Tipo de usuário inválido' });
    }}  

    static async showMonitorDate (req: Request, res: Response){
      const idUsuario = req.headers.userId
      const { data } = req.body

      if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })
      const usuario = await Usuario.findOneBy({id: Number(idUsuario)})

      if (!data) return res.status(400).json("Data deve ser informada")

      const aDateStr = new Date(data).toISOString().split('T')[0]

      if (usuario !== null){
      //exibição para usuário monitor
      if (usuario?.tipo == "Monitor") {

      //encontrar as monitorias deste monitor para dps poder retornar os agendamentos delas
        const monitorias = await Monitoria.find({
          where: { usuario: usuario },
          relations: ['agendamentos', 'local', 'materia', 'usuario'] 
          })

      //contagem de agendamentos associados a essa monitoria
          const contagemAlunos = new Map<number, Map<string, number>>()
          monitorias.forEach(monitoria => {
          
          if (!contagemAlunos.has(monitoria.id)) {
            contagemAlunos.set(monitoria.id, new Map<string, number>())
          }
        
          const dataContagem = contagemAlunos.get(monitoria.id)!
          monitoria.agendamentos.forEach(agendamento => {

            console.log("Agendamentodata ", new Date (agendamento.data))
              const dataConv = agendamento.data.toISOString().split('T')[0]
              const count = dataContagem.get(dataConv) || 0
              dataContagem.set(dataConv, count + 1)
              console.log("data contagem e dataconv", dataContagem, dataConv)
          })
      })
        console.log("Consulta: agendamentos - Monitor")
      
        const resultado = monitorias.flatMap(monitoria => 
          monitoria.agendamentos
            .filter(agendamento => agendamento.data.toISOString().split('T')[0] === aDateStr)
            .map(agendamento => {
              const dataConv = agendamento.data.toISOString().split('T')[0]
              const quantidadeAluno = contagemAlunos.get(monitoria.id)?.get(dataConv) || 0
              return {
                local: monitoria.local
                  ? (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`)
                  : '',
                quantidadeAluno,
                data: agendamento.data,
                obs: agendamento.observacao,
                dia_semana: monitoria.dia_semana || '',
                horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
                idMonitoria: monitoria.id,
                idFotoMateria: monitoria.materia.idFoto ?? '1',
                id: agendamento.id,
                materia: monitoria.materia?.nome,
              }
            })
        )
    
        const resultadoOrdenado = resultado.sort((a, b) => a.data.getTime() - b.data.getTime())
    
        /*if (resultadoOrdenado.length === 0) {
          return res.status(200).json(null)
        }*/
    
        return res.status(200).json(resultadoOrdenado)
      }
    
      return res.status(400).json({ error: 'Tipo de usuário inválido' })
    }
    }

    static async delete (req: Request, res: Response) {
    const { id } = req.body
    const idUsuario = req.headers.userId

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O agendamento deve ser informado para exclusão' })
    }

    if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário sem autenticação' })
    const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
    
    if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' })
    const agendado = await Agendamento.findOne({ where: {id: Number(id), usuario: usuario }})

    if (!agendado) return res.status(404).json({ error: 'Agendamento não encontrado' })

    console.log('Agendado:', agendado, ' - usuario: ', usuario)
    
    await agendado.remove()
    return res.status(200).json('Agendamento excluído!')
    }


  static async alunosAgendados (req: Request, res: Response){
    const idUsuario = req.headers.userId
    const { id } = req.body

    if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })
    const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
    if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' })
    
    if (!id || isNaN(Number(id))) return res.status(400).json({ error: 'Selecione um agendamento' })
    
    const agendamento = await Agendamento.findOne({ where: { id: Number(id) }, relations: ['monitoria']})
    if (!agendamento) return res.status(400).json({ error: 'Selecione um agendamento' })
    const monitoriaId = agendamento.monitoria.id

    const dataAgendamento = new Date((agendamento.data).toISOString().split('T')[0])

    const monitoria = await Monitoria.findOneBy({ id: monitoriaId })
    if (!monitoria) return res.status(400).json({ error: 'Monitoria não existe' })

      if (usuario !== null){
        const agendamentos = await Agendamento.find({
          where: { monitoria: monitoria, data: dataAgendamento },
          relations: ['monitoria', 'usuario'] 
          })     
        const resultado = agendamentos.map(x => ({
                materia: x.monitoria.materia,
                data: dataAgendamento,
                id: x.usuario.id,
                nome: x.usuario.nome,
                email: x.usuario.email,
                ra: x.usuario.ra
              })).sort((a, b) => a.nome.localeCompare(b.nome))

      return res.status(200).json(resultado)
      }
      res.status(400).json({ error: 'Usuário não autenticado' })
    }
}