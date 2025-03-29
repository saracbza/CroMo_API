import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'


@Entity()
export default class Contato extends BaseEntity {
      @PrimaryGeneratedColumn()
      id!: number

      @Column()
      nome!: string

      @Column()
      teamsUser!: string

      @Column()
      teamsEmail!: string
}