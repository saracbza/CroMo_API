import { Router } from 'express'
import agendamentoRoutes from './agendamento/agendamento.routes'
import materiaRoutes from './materia/materia.routes'
import monitoriaRoutes from './monitoria/monitoria.routes'
import authRoutes from './auth/auth.routes'
import localRoutes from './local/local.routes'
import agendaRoutes from './agenda/agenda.routes'
import contatoRoutes from './contato/contato.routes'

const routes = Router()

routes.use('/agendamento', agendamentoRoutes)
routes.use('/materia', materiaRoutes)
routes.use('/monitoria', monitoriaRoutes)
routes.use('/local', localRoutes)
routes.use('/auth', authRoutes)
routes.use('/agenda', agendaRoutes)
routes.use('/contato', contatoRoutes)

export default routes