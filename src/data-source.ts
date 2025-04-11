import { DataSource } from 'typeorm'
import Usuario from './models/Usuario'
import TokenRecuperacao from './models/TokenRecuperacao'

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Usuario, TokenRecuperacao],
  migrations: [],
  subscribers: [],
})
