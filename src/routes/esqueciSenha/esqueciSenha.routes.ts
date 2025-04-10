import { Router } from 'express'
import AuthController from '../../controllers/auth/auth.controller'

const esqueciSenhaRoutes = Router()

esqueciSenhaRoutes.post('/esqueci-senha', AuthController.esqueciSenha)
esqueciSenhaRoutes.post('/reset-senha', AuthController.resetSenha)

export default esqueciSenhaRoutes