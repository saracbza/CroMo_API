import { Router } from 'express'
import AgendaController from '../../controllers/agenda/agenda.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const agendaRoutes = Router()

agendaRoutes.post('/store', authMiddleware, AgendaController.store)
agendaRoutes.get('/show', authMiddleware, AgendaController.show)
agendaRoutes.delete('/delete', authMiddleware, AgendaController.delete)

export default agendaRoutes