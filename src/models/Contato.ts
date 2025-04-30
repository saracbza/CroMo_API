import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'


@Entity()
export default class Contato extends BaseEntity {
      @PrimaryGeneratedColumn()
      id!: number

      @Column()
      nome!: string

      @Column({default: 1})
      idFoto!: number

      @Column()
      teamsUser?: string

      @Column()
      tipo!: string

      @Column()
      teamsEmail?: string
}