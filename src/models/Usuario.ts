import { version } from './../../node_modules/@types/validator/index.d';
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm'
import Agendamento from "./Agendamento"
import Monitoria from "./Monitoria"
import { opcoesCursos } from '../utils/validacoes'
import { IsEnum } from 'class-validator'
import Agenda from './Agenda';

@Entity()
@Unique(["email"])
export default class Usuario extends BaseEntity {
	  @PrimaryGeneratedColumn()
	  id!:number

	  @Column({default: 1})
	  idFoto!: number
	  
	  @Column()
	  email!: string

	  @Column()
	  nome!: string

	  @Column()
	  senha!: string
	  
	  @Column({
        type: 'text',
        enum: opcoesCursos,
		nullable: true,
		default: ""
    })
	  @IsEnum(opcoesCursos, { message: 'Curso inválido' })
	  curso?: opcoesCursos

	  @Column()
	  tipo!: string
  
	  @OneToMany(() => Monitoria, monitoria => monitoria.usuario)
	  monitorias?: Monitoria[]

	  @OneToMany(() => Agenda, agenda => agenda.usuario)
	  agendas?: Agenda[]
	  
	  @OneToMany(() => Agendamento, agendamento => agendamento.usuario)
	  agendamentos?: Agendamento[]
}