import { Router } from 'express'
import ContatoController from '../../controllers/contato/contato.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const contatoRoutes = Router()

contatoRoutes.post('/', authMiddleware, ContatoController.store)
contatoRoutes.get('/', authMiddleware, ContatoController.show)
contatoRoutes.delete('/', authMiddleware, ContatoController.delete)

export default contatoRoutes