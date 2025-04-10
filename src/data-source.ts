import { DataSource } from 'typeorm'
import Usuario from './models/Usuario'
import EsqueciSenha from './models/EsqueciSenha'

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Usuario, EsqueciSenha],
  migrations: [],
  subscribers: [],
})
