import { Request, Response } from 'express'
import { diasDaSemana } from './../../utils/validacoes'
import Usuario from '../../models/Usuario'
import Local from '../../models/Local'
import Agenda from '../../models/Agenda'

export default class AgendaController{
    static async store (req: Request, res: Response){
        const usuarioId = req.headers.userId
        const { dia_semana, horario_inicio, horario_fim, idLocal, nomeMateria } = req.body 
        
        if (!usuarioId || isNaN(Number(usuarioId))) return res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(usuarioId)})
       // if (usuario?.tipo == "Monitor") return res.status(403).json("Usuário não possui permissão de acesso")

        if(!idLocal || isNaN(Number(idLocal))) return  res.status(400).json("Local é obrigatório")
        const local = await Local.findOneBy({id: Number(idLocal)})
        if (!local) return  res.status(400).json("Local informado não existe")

        if(!nomeMateria)  return res.status(400).json("Nome da matéria é obrigatório")

        if(!dia_semana|| !horario_inicio || !horario_fim ) 
        return  res.status(400).json({error: "Todos os dados são obrigatórios!"})

        const semanaLower = [
          "segunda-feira", "terça-feira", "quarta-feira", 
          "quinta-feira", "sexta-feira", "sábado", "domingo",
      ]

        if (!semanaLower.includes(dia_semana.toLowerCase()))
        return res.status(400).json("Dia da semana informado não existe")

        if (local !== null && usuario !== null){
	       const agenda = new Agenda()
	       agenda.dia_semana = dia_semana
	       agenda.horario_inicio = horario_inicio
         agenda.horario_fim = horario_fim
	       agenda.local = local
	       agenda.nome_materia = nomeMateria
	       agenda.usuario = usuario
	       await agenda.save() 
	      
        return res.status(201).json({
          materia: agenda.nome_materia,
          dia_semana: agenda.dia_semana,
          horario_inicio: agenda.horario_inicio,
          horario_fim: agenda.horario_fim,
          local: agenda.local
        })}

	      }  
     
    static async show (req: Request, res: Response) {
      const { monitorId } = req.params
    
      if (!monitorId || isNaN(Number(monitorId))) {
        return res.status(400).json({ error: 'Monitor não informado corretamente' })
      }
    
      const monitor = await Usuario.findOneBy({ id: Number(monitorId) })
    
      if (!monitor) return res.status(404).json({ error: 'Monitor não encontrado' })
      if (monitor.tipo !== 'Monitor') return res.status(403).json({ error: 'Usuário informado não é um monitor' })
    
      const agendas = await Agenda.find({
        relations: ['local'],
        where: { usuario: { id: monitor.id } }
      })
    
      console.log('Agendas encontradas:', agendas.map(a => `(${a.id}) "${a.dia_semana}"`))
    
      const resultado = agendas.map(agenda => ({
        id: agenda.id,
        materia: agenda.nome_materia,
        dia_semana: agenda.dia_semana,
        horario: `${agenda.horario_inicio} - ${agenda.horario_fim}`,
        local: agenda.local
          ? (agenda.local.numero ? `${agenda.local.tipo} ${agenda.local.numero}` : `${agenda.local.tipo}`)
          : '',
      }))
    
      resultado.sort((a, b) =>
        diasDaSemana.findIndex(d => d.toLowerCase() === a.dia_semana.toLowerCase()) -
        diasDaSemana.findIndex(d => d.toLowerCase() === b.dia_semana.toLowerCase())
      )
    
      return res.status(200).json(resultado)
    }

    static async showAgenda(req: Request, res: Response) {
      const usuarioId = req.headers.userId
    
      if (!usuarioId || isNaN(Number(usuarioId))) {
        return res.status(401).json({ error: 'Usuário não autenticado' })
      }
    
      const usuario = await Usuario.findOneBy({ id: Number(usuarioId) })
      if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' })
    
      const agendas = await Agenda.find({
        where: { usuario: { id: usuario.id } },
        relations: ['local'],
      })
    
      console.log('Agendas encontradas:', agendas.map(a => `(${a.id}) "${a.dia_semana}"`))
    
      const resultado = agendas.map(agenda => ({
        id: agenda.id,
        materia: agenda.nome_materia,
        dia_semana: agenda.dia_semana,
        horario: `${agenda.horario_inicio} - ${agenda.horario_fim}`,
        local: agenda.local
          ? (agenda.local.numero ? `${agenda.local.tipo} ${agenda.local.numero}` : `${agenda.local.tipo}`)
          : '',
      }))
    
      resultado.sort((a, b) =>
        diasDaSemana.findIndex(d => d.toLowerCase() === a.dia_semana.toLowerCase()) -
        diasDaSemana.findIndex(d => d.toLowerCase() === b.dia_semana.toLowerCase())
      )
    
      return res.status(200).json(resultado)
    }        

    static async delete (req: Request, res: Response) {
      const { id } = req.params
      const usuarioId = req.headers.userId

      if(!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'A agenda deve ser informada para exclusão' })
      }

      if (!usuarioId || isNaN(Number(usuarioId))) return res.status(401).json({ error: 'Usuário sem autenticação' })
      const usuario = await Usuario.findOneBy({ id: Number(usuarioId) })
      
      if (!usuario) return res.status(401).json({ error: 'Usuário não autenticado' })
      const agenda = await Agenda.findOne({ where: {id: Number(id), usuario: usuario }})

      if (!agenda) return res.status(404).json({ error: 'Agenda não encontrada' })

      await agenda.remove()
      return res.status(204).json('Agenda excluída!')
    }       
  }