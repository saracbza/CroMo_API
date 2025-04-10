// src/controllers/auth/auth.service.ts
import { AppDataSource } from '../../data-source'
import Usuario from '../../models/Usuario'
import EsqueciSenha from '../../models/EsqueciSenha'
import { enviarEmailSenha } from '../../utils/enviarEmail'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export default class AuthService {
  static async requestResetSenha(email: string): Promise<void> {
    const usuario = await Usuario.findOneBy({ email })
    if (!usuario) throw new Error('Usuário não encontrado')

    const token = crypto.randomBytes(20).toString('hex')

    const resetToken = new EsqueciSenha()
    resetToken.usuario = usuario
    resetToken.token = token    
    resetToken.expiraEm = new Date(Date.now() + 3600 * 1000) // 1 hora
    await resetToken.save()

    await enviarEmailSenha(
        usuario.email,
        'Redefinir senha',
        `Use este token para redefinir sua senha: ${token}`
    )
  }

  static async resetSenha(token: string, novaSenha: string): Promise<void> {
    const resetToken = await EsqueciSenha.findOne({
      where: { token },
      relations: ['usuario']
    })

    if (!resetToken || resetToken.expiraEm < new Date()) {
      throw new Error('Token inválido ou expirado')
    }

    const usuario = resetToken.usuario
    usuario.senha = bcrypt.hashSync(novaSenha, 10)
    await usuario.save()

    await resetToken.remove() // remove o token após o uso
  }
}
