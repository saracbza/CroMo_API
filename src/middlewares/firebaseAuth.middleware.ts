import { Request, Response, NextFunction } from 'express'
import admin from '../firebase'

export default async function firebaseAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-firebase-token'] as string

    if (!token) return res.status(401).json({ error: 'Token não fornecido' })

    try {
        const decoded = await admin.auth().verifyIdToken(token);
        console.log("Token Decodificado:", decoded)
        req.body.firebaseUid = decoded.uid
        req.body.firebaseEmail = decoded.email
        next()
    } catch (error) {
        console.error('Erro ao validar token:', error)
        return res.status(401).json({ error: 'Token inválido ou expirado' })
    }
}
