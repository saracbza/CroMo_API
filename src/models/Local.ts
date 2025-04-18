import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Monitoria from './Monitoria'
import { TipoLocal } from "../utils/validacoes"
import { IsEnum } from 'class-validator'
import Agenda from "./Agenda"

@Entity()
export default class Local extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({nullable: true, default: ""})
    numero?: number

    @Column({
        type: 'text',
        enum: TipoLocal
    })
    @IsEnum(TipoLocal, { message: 'Tipo de local inválido' })
    tipo!: TipoLocal

    @OneToMany(() => Monitoria, monitoria => monitoria.local)
    monitorias!: Monitoria[]

    @OneToMany(() => Agenda, agenda => agenda.local)
    agendas!: Agenda[]
}