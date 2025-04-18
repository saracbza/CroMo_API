import { Request, Response } from 'express'
import Monitoria from '../../models/Monitoria'
import Materia from '../../models/Materia'
import { diaDaSemana } from '../../utils/validacoes'
import Usuario from '../../models/Usuario'
import Local from '../../models/Local'

export default class MonitoriaController{
    static async store (req: Request, res: Response){
        const idUsuario = req.headers.userId
        const { dia_semana, horario_inicio, horario_fim, idLocal, idMateria } = req.body 
        
        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno") res.status(403).json("Usuário não possui permissão de acesso")

        if(!idLocal || isNaN(Number(idLocal))) res.json("Local é obrigatório")
        const local = await Local.findOneBy({id: Number(idLocal)})
        if (!local) res.json("Local informado não existe")

        if(!idMateria || isNaN(Number(idMateria))) res.json("Local é obrigatório")
        const materia = await Materia.findOneBy({id: Number(idMateria)})
        if (!materia) res.json("Materia informada não existe")

        if(!dia_semana|| !horario_inicio || !horario_fim ) 
        res.status(400).json({error: "Todos os dados são obrigatórios!"})

        if (local !== null && materia !== null && usuario !== null){
	       const monitoria = new Monitoria()
	       monitoria.dia_semana = dia_semana
	       monitoria.horario_inicio = horario_inicio
         monitoria.horario_fim = horario_fim
	       monitoria.local = local
	       monitoria.materia = materia
	       monitoria.usuario = usuario
	       await monitoria.save() 
	      
        return res.status(201).json({
          materia: monitoria.materia.nome,
          dia_semana: monitoria.dia_semana,
          horario_inicio: monitoria.horario_inicio,
          horario_fim: monitoria.horario_fim,
          local: monitoria.local,
          monitor: monitoria.usuario.nome,
          foto: monitoria.usuario.idFoto,
          idFoto: monitoria.materia.idFoto
        })}

	      }

//mostra todas as monitorias do dia da semana da data escolhida
	static async show (req: Request, res: Response){
        const { data } = req.body
        const idUsuario = req.headers.userId
        
        if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (!usuario) return res.json("Usuário não existe")
        
        if (!data) return res.json("Data deve ser preenchida")
        
        const dataForm = new Date(data)
        console.log(dataForm)
				const dia_semana = diaDaSemana(new Date(dataForm))
        console.log(dia_semana)
				
        const monitorias = await Monitoria.find({
          relations: ['materia', 'local', 'usuario'],
          where: { dia_semana: dia_semana }
         })

         const resultado = monitorias.map (monitoria => {
            return {
              id: monitoria.id,
              materia: monitoria.materia.nome,
              dia_semana: monitoria.dia_semana,
              horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
              local: monitoria.local ?
              (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`) 
              : '',
              monitor: monitoria.usuario.nome,
              foto: monitoria.usuario.idFoto,
              idFoto: monitoria.materia.idFoto
            }
         })
         console.log(resultado)
         return res.status(200).json(resultado)
     }     
  
  //mostra todas as monitorias do dia da semana da data escolhida
	static async showMonitor (req: Request, res: Response){
    const { data, idMonitor } = req.body
    const idUsuario = req.headers.userId

    const teste = idMonitor
    console.log(teste)

    if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })

    const usuario = await Usuario.findOneBy({ id: Number(idUsuario) })
    if (!usuario) return res.json("Usuário não existe")
    
    if (!idMonitor || isNaN(Number(idMonitor))) return res.json({ error: "Monitor deve ser preenchido" })

    const monitor = await Usuario.findOneBy({ id: Number(idMonitor) })
    if (!monitor || monitor?.tipo != "Monitor") return res.json({error: "Id informado deve ser de monitor"})
    if (!data) return res.json("Data deve ser preenchida")
    const dataForm = new Date(data)

    const dia_semana = diaDaSemana(new Date(dataForm))
    
    const monitorias = await Monitoria.find({
      relations: ['materia', 'local', 'usuario'],
      where: { dia_semana: dia_semana, usuario: monitor }
     })

     const resultado = monitorias.map (monitoria => {
        return {
          id: monitoria.id,
          materia: monitoria.materia.nome,
          dia_semana: monitoria.dia_semana,
          horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
          local: monitoria.local ?
          (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`) 
          : '',
          monitor: monitoria.usuario.nome,
          idFoto: monitoria.materia.idFoto
        }
     })
     console.log(resultado)
     return res.status(200).json(resultado)
 } 
     
   /*  static async showSemana (req: Request, res: Response){
      const { diaSemana } = req.body
      const idUsuario = req.headers.userId
      
      if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

      const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
      if (!usuario) res.json("Usuário não existe")

      const monitorias = await Monitoria.find({
        relations: ['materia', 'local'],
        where: { dia_semana: diaSemana }
       })

       const resultado = monitorias.map (monitoria => {
          return {
            id: monitoria.id,
            materia: monitoria.materia.nome,
            dia_semana: monitoria.dia_semana,
            horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
            local: monitoria.local ?
            (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`) 
            : '',
          }
       })

       return res.status(200).json(resultado)
   }  */ 

  /*   static async showMonitor (req: Request, res: Response){
      const idUsuario = req.headers.userId
      
      if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

      const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
      if (!usuario) res.json("Usuário não existe")
      
      if (usuario !== null) {
        const monitorias = await Monitoria.find({
          relations: ['materia', 'local'],
          where: { usuario: usuario }
        })

        const resultado = monitorias.map (monitoria => {
          return {
            id: monitoria.id,
            materia: monitoria.materia.nome,
            dia_semana: monitoria.dia_semana,
            horario: `${monitoria.horario_inicio} - ${monitoria.horario_fim}`,
            local: monitoria.local ?
            (monitoria.local.numero ? `${monitoria.local.tipo} ${monitoria.local.numero}` : `${monitoria.local.tipo}`) 
            : '',
          }
       })
       console.log(resultado)
       return res.status(200).json(resultado)
      }
       
   }  */ 
    }