import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../../models/Usuario' 
import { emailInstitucional } from '../../utils/validacoes'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'
import { AppDataSource } from '../../data-source'
import TokenRecuperacao from '../../models/TokenRecuperacao'

export default class AuthController {
    static enviarEmailRedefinicao(arg0: string, enviarEmailRedefinicao: any) {
        throw new Error('Method not implemented.')
    }
    static redefinirSenha(arg0: string, redefinirSenha: any) {
        throw new Error('Method not implemented.')
    }

static async store (req: Request, res: Response){
        const { nome, email, senha, curso, tipo, idFoto } = req.body 
        
        if(!nome || !tipo ) return res.status(400).json({error: "Nome e tipo obrigatórios!"}) 
        if(!email || !senha) return res.status(400).json({error: "Email e senha obrigatórios!"})
        if(!emailInstitucional(email)) return res.status(422).json({error: "Email inválido!"})
        
        const usuarioCheck = await Usuario.findOneBy({ email })
        if (usuarioCheck) return res.status(409).json({ error: 'Email já cadastrado' })
        
        if (tipo == "Aluno") //aluno
	        if(!curso) return res.status(400).json({error: "Curso obrigatório"})
        
		const usuario = new Usuario()
		usuario.nome = nome
		usuario.email = email
	    usuario.senha = bcrypt.hashSync(senha, 10)
	    usuario.curso = curso ?? ""
        usuario.tipo = tipo
        usuario.idFoto = idFoto ?? 1
	    await usuario.save() 
	        
		return res.status(200).json({
	       nome: usuario.nome,
	       email: usuario.email,
	       curso: usuario.curso ?? ""
        }) 
	      }

    static async login (req: Request, res: Response){
        const { email, senha } = req.body

        if (!email || !senha) return res.status(400).json({error: "Email e senha são obrigatórios"})

        const usuario = await Usuario.findOneBy ({ email })
        if (!usuario) return res.status(401).json({error: "Usuário não encontrado"})
        const idUsuario = usuario.id

	    const senhaCheck = bcrypt.compareSync(senha, usuario.senha)
	    if (!senhaCheck) return res.status(401).json({error: "Senha inválida"})
        //const secret = crypto.randomBytes(32).toString('hex')
	    const token = jwt.sign({idUsuario}, process.env.SECRET as string, { expiresIn: '1h'})

        /*localStorage.setItem('secret', secret)
        localStorage.setItem('token', token)*/

        axios.defaults.headers.common['x-access-token'] = token

        return res.status(200).json({ 
            nome: usuario.nome, 
            curso: usuario.curso, 
            tipo: usuario.tipo, 
            foto: usuario.idFoto,
            token })
    }

    static async logout (req: Request, res:Response) {
        const idUsuario = req.headers.userId
        const usuario = await Usuario.findOneBy ({ id: Number(idUsuario) })
        delete axios.defaults.headers.common['x-access-token']
        /*localStorage.removeItem('token')
        localStorage.removeItem('secret')*/
        
        console.log(`Usuário ${usuario?.nome} saiu`)
        return res.status(200).json({auth: false})
    }

    static async mudarFoto (req: Request, res:Response) {
        const idUsuario = req.headers.userId
        const { fotoId } = req.body
        console.log("foto passada: ", Number(fotoId))
        if (!fotoId) return res.json({error: "Foto não informada"})
        const usuario = await Usuario.findOneBy ({ id: Number(idUsuario) })
        if (usuario !== null){
            usuario.idFoto = Number(fotoId) ? Number(fotoId) : usuario?.idFoto
            await usuario?.save()
        }

        return res.status(200).json('Foto alterada')
    }
    static async showMonitores (req: Request, res:Response) {
        const monitores = await Usuario.find ({ where: {tipo: 'Monitor'} })
        if (!monitores) return res.status(404).json('Monitores não encontrados')
        return res.status(200).json(monitores)
    }

    static async showMonitoresMonitoria (req: Request, res: Response) {
        try {
          const monitores = await Usuario.createQueryBuilder('usuario')
            .leftJoinAndSelect('usuario.monitorias', 'monitoria')
            .leftJoinAndSelect('monitoria.materia', 'materia')
            .where('usuario.tipo = :tipo', { tipo: 'Monitor' })
            .getMany()
      
          if (!monitores || monitores.length === 0) {
            return res.status(404).json({ error: 'Monitores não encontrados' })
          }
      
          return res.status(200).json(monitores)
        } catch (error) {
          console.error('Erro ao buscar monitores:', error)
          return res.status(500).json({ error: 'Erro interno no servidor' })
        }
      }
}            