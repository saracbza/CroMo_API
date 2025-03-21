import { Router } from 'express'
import AgendaController from '../../controllers/agenda/agenda.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const agendaRoutes = Router()

agendaRoutes.post('/store', authMiddleware, AgendaController.store)
agendaRoutes.post('/show', authMiddleware, AgendaController.show)

export default agendaRoutes