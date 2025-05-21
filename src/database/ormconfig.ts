import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const dataBase = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE || './src/database/database.sqlite',
  entities: [
    path.join(__dirname, '..',  '/models/*.{ts,js}')
  ],
  logging: true,
  synchronize: true,
})

const initializeDatabase = async () => {
  try {
    await dataBase.initialize()
    console.log('Banco de dados inicializado com sucesso!')
  } catch (e) {
    console.error('Erro ao inicializar o banco de dados:', e)
    throw e
  }
}

export { dataBase, initializeDatabase }