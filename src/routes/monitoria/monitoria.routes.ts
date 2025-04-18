import { Router } from 'express'
import MonitoriaController from '../../controllers/monitoria/monitoria.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const monitoriaRoutes = Router()

monitoriaRoutes.post('/', authMiddleware, MonitoriaController.store)
monitoriaRoutes.post('/show', authMiddleware, MonitoriaController.show)
//monitoriaRoutes.get('/showMonitor', authMiddleware, MonitoriaController.showMonitor)

export default monitoriaRoutes