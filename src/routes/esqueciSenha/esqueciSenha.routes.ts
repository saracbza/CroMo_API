import { Router } from 'express'
import { enviarEmailRedefinicao, redefinirSenha } from '../../controllers/auth/auth.service'

const esqueciSenhaRoutes = Router()

esqueciSenhaRoutes.post('/esqueci-senha', enviarEmailRedefinicao)
esqueciSenhaRoutes.post('/reset-senha', redefinirSenha)

export default esqueciSenhaRoutes