import { Router } from 'express'
import AuthController from '../../controllers/auth/auth.controller'
import authMiddleware from '../../middlewares/auth.middleware'
import firebaseAuth from '../../middlewares/firebaseAuth.middleware'
import Usuario from '../../models/Usuario'

const authRoutes = Router()

authRoutes.get('/perfil', firebaseAuth, async (req, res) => {
    const { firebaseEmail } = req.body
    
    const usuario = await Usuario.findOneBy({ email: firebaseEmail })
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' })

    return res.json({
        nome: usuario.nome,
        curso: usuario.curso,
        tipo: usuario.tipo
    })
})

authRoutes.post('/register', AuthController.store)
authRoutes.post('/firebase-login', firebaseAuth, AuthController.firebaseLogin)
authRoutes.post('/login', AuthController.login)
//authRoutes.post('/refresh', AuthController.refresh)
authRoutes.post('/logout', authMiddleware, AuthController.logout)
authRoutes.post('/mudarFoto', authMiddleware, AuthController.mudarFoto)
authRoutes.get('/monitores', authMiddleware, AuthController.showMonitores)
authRoutes.get('/monitoresMonitoria', authMiddleware, AuthController.showMonitoresMonitoria)

export default authRoutes