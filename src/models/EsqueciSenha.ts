import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'
import Usuario  from "./Usuario"

@Entity()
export default class EsqueciSenha extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  token!: string

  @Column()
  expiraEm!: Date

  @CreateDateColumn()
  criadoEm!: Date

  @UpdateDateColumn()
  atualizadoEm!: Date

  @ManyToOne(() => Usuario, usuario => usuario.esqueciSenha, { onDelete: 'CASCADE' })
  usuario!: Usuario
}
