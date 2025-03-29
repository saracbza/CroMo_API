import { Router } from 'express'
import AgendaController from '../../controllers/agenda/agenda.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const agendaRoutes = Router()

agendaRoutes.post('/', authMiddleware, AgendaController.store)
agendaRoutes.get('/', authMiddleware, AgendaController.show)
agendaRoutes.delete('/', authMiddleware, AgendaController.delete)

export default agendaRoutes