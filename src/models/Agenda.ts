import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import Usuario from './Usuario'
import Local from './Local'

@Entity()
export default class Agenda extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!: number

	  @Column()
	  dia_semana!: string

	  @Column()
	  nome_materia!: string
  
	  @Column({ length: 5 })
	  horario_inicio!: string //HH:MM

	  @Column({ length: 5 })
	  horario_fim!: string //HH:MM
  
	  @ManyToOne(() => Usuario, usuario => usuario.agendas)
	  usuario!: Usuario

	  @ManyToOne(() => Local, local => local.agendas)
	  local!: Local
}