import { Router } from 'express'
import MateriaController from '../../controllers/materia/materia.controller'
import authMiddleware from '../../middlewares/auth.middleware'

const materiaRoutes = Router()

materiaRoutes.post('/', authMiddleware, MateriaController.store)
materiaRoutes.get('/', authMiddleware, MateriaController.show)
materiaRoutes.get('/', authMiddleware, MateriaController.showAllClass)
materiaRoutes.get('/:id/monitorias', authMiddleware, MateriaController.getMonitoriasByMateria)

export default materiaRoutes