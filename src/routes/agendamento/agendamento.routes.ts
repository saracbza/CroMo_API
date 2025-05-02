import { Router } from 'express'
import AgendamentoController from '../../controllers/agendamento/agendamento.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const agendamentoRoutes = Router()

agendamentoRoutes.post('/', authMiddleware, AgendamentoController.store)
agendamentoRoutes.get('/aluno', authMiddleware, AgendamentoController.showAluno)
agendamentoRoutes.get('/monitor', authMiddleware, AgendamentoController.showMonitor)
agendamentoRoutes.post('/alunosAgendados', authMiddleware, AgendamentoController.alunosAgendados)
agendamentoRoutes.delete('/delete', authMiddleware, AgendamentoController.delete)

export default agendamentoRoutes