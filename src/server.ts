import express from 'express'
import { initializeDatabase, dataBase } from './database/ormconfig'
import seed from './database/seed'
import routes from './routes'
import cors from 'cors'

require('dotenv').config()
const app = express()
const port = Number(process.env.PORT) || 3000

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'x-access-token', 'userId']
}))
app.use(express.json())
app.use(routes)

const startServer = async () => {
  try {
    await initializeDatabase()
    
    await seed();
    console.log('Seed executado com sucesso!')

    app.listen(port, '0.0.0.0', () => {
      console.log(`Servidor executando na porta ${port}`)
    })
  } catch (error) {
    console.error('Erro ao inicializar a aplicação:', error)
  }
}

startServer()
