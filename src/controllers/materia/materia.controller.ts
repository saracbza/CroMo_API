import { NextFunction, Request, Response } from 'express'
import Materia from '../../models/Materia'
import Usuario from '../../models/Usuario'
import { AppDataSource } from '../../data-source'
import Monitoria from '../../models/Monitoria'

export default class MateriaController {
  static async store (req: Request, res: Response){
    const idUsuario = req.headers.userId
    const { nome } = req.body 

    if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

    const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
    if (usuario?.tipo == "Aluno" || !usuario) res.status(403).json("Usuário não possui permissão de acesso")

    if(!nome) return res.status(400).json({error: "Nome obrigatório!"})
    
    const materia = new Materia()
    materia.nome = nome
    await materia.save() 
            
    return res.json(materia) 
  }
    
  static async show (req: Request, res: Response){
    const  idUsuario = req.headers.userId
    if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário não autenticado' })    
        
    const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
    if (!usuario) res.json("Usuário não encontrado")    

    const materia = await Materia.find()
      if (!materia) 
      return res.status(404)
      return res.json(materia) 
  }

  static async showAllClass(req: Request, res: Response) {
    const idUsuario = req.headers.userid

    if (!idUsuario || isNaN(Number(idUsuario))) {
      return res.status(401).json({ error: 'Usuário não autenticado' })
    }

    const usuario = await Usuario.findOneBy({ id: Number(idUsuario) })
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' })

    try {
      const materias = await Materia.find()
      return res.json(materias)
    } catch (error) {
      console.error('Erro ao buscar matérias:', error)
      return res.status(500).json({ error: 'Erro interno ao buscar matérias' })
    }
  }

  static async getMonitoriasByMateria(req: Request, res: Response) {
    const materiaId = Number(req.params.id)

    try {
      const monitorias = await AppDataSource.getRepository(Monitoria).find({
        where: { materia: { id: materiaId } },
        relations: ['materia', 'local'],
      })

      return res.status(200).json(monitorias)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao buscar monitorias da matéria.' })
    }
  }
}