import { Request, Response } from 'express'
import Usuario from '../../models/Usuario'
import Contato from '../../models/Contato'

export default class ContatoController{
    static async store (req: Request, res: Response){
        const idUsuario = req.headers.userId
        const { nome, teamsUser, teamsEmail } = req.body 
        
        if (!idUsuario || isNaN(Number(idUsuario))) res.status(401).json({ error: 'Usuário não autenticado' })

        const usuario = await Usuario.findOneBy({id: Number(idUsuario)})
        if (usuario?.tipo == "Aluno") res.status(403).json("Usuário não possui permissão de acesso")

        if(!nome|| !teamsUser || !teamsEmail ) 
        res.status(400).json({error: "Todos os dados são obrigatórios!"})

        const contato = new Contato()
        contato.nome = nome
        contato.teamsUser = teamsUser
        contato.teamsEmail = teamsEmail
        await contato.save() 
          
        return res.status(201).json({
          nome: contato.nome,
          teamsUser: contato.teamsUser,
          teamsEmail: contato.teamsEmail,
        })}  
     
     static async show (req: Request, res: Response){
        const contatos = await Contato.find()

        const resultado = contatos.map (c => {
          return {
            id: c.id,
            nome: c.nome,
            teamsUser: c.teamsUser,
            teamsEmail: c.teamsEmail,
          }
       })
       return res.status(200).json(resultado)
      }
 
   static async delete (req: Request, res: Response) {
    const { id } = req.params
    const idUsuario = req.headers.userId

    if(!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'O contato deve ser informado para exclusão' })
    }

    if (!idUsuario || isNaN(Number(idUsuario))) return res.status(401).json({ error: 'Usuário sem autenticação' })
    const usuario = await Usuario.findOneBy({id: Number(id)})
    
    if (usuario?.tipo == "Aluno") return res.status(403).json("Usuário não possui permissão de acesso")
    const contato = await Contato.findOne({ where: {id: Number(id)}})

    if (!contato) return res.status(404).json({ error: 'Contato não encontrado' })

    await contato.remove()
    return res.status(204).json('Contato excluído!')
    } 
    }