import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from 'typeorm'
import Usuario  from "./Usuario"

@Entity()
export default class TokenRecuperacao extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  token!: string

  @Column()
  expiraEm!: Date

  @ManyToOne(() => Usuario)
  usuario!: Usuario
}