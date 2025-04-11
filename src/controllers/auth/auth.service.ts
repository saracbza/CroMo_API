import { dataBase } from '../../database/ormconfig'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../../models/Usuario' 
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'
import TokenRecuperacao from '../../models/TokenRecuperacao'

const resend = new Resend(process.env.RESEND_API_KEY);

    export const enviarEmailRedefinicao = async (req: Request, res: Response) => {
      const { email } = req.body
    
      const userRepo = dataBase.getRepository(Usuario)
      const tokenRepo = dataBase.getRepository(TokenRecuperacao)
    
      const usuario = await userRepo.findOne({ where: { email } })
    
      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }
    
      const token = uuidv4()
      const expiraEm = new Date()
      expiraEm.setHours(expiraEm.getHours() + 1)
    
      const novoToken = tokenRepo.create({
        token,
        usuario,
        expiraEm,
      })
    
      await tokenRepo.save(novoToken)
    
      const link = `https://cro-mo.app/redefinir-senha?token=${token}`
    
      await resend.emails.send({
        from: 'CroMo <no-reply@cromo.app>',
        to: email,
        subject: 'Redefinição de senha',
        html: `
          <p>Olá, ${usuario.nome}!</p>
          <p>Clique no link abaixo para redefinir sua senha. Esse link é válido por 1 hora.</p>
          <a href="${link}">${link}</a>
        `,
      })
    
      return res.status(200).json({ message: 'E-mail enviado com sucesso!' })
    }
    
    export const redefinirSenha = async (req: Request, res: Response) => {
      const { token, novaSenha } = req.body
    
      const tokenRepo = dataBase.getRepository(TokenRecuperacao)
    
      const tokenRec = await tokenRepo.findOne({
        where: { token },
        relations: ['usuario'],
      })
    
      if (!tokenRec) {
        return res.status(400).json({ error: 'Token inválido' })
      }
    
      const agora = new Date()
      if (agora > tokenRec.expiraEm) {
        await tokenRepo.remove(tokenRec) // limpa token expirado
        return res.status(400).json({ error: 'Token expirado' })
      }
    
      const usuario = tokenRec.usuario
      const novaSenhaHash = await bcrypt.hash(novaSenha, 10)
      usuario.senha = novaSenhaHash
    
      await dataBase.getRepository(Usuario).save(usuario)
      await tokenRepo.remove(tokenRec) // remove o token após uso
    
      return res.status(200).json({ message: 'Senha redefinida com sucesso!' })
    }
