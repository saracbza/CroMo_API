import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import Monitoria from './Monitoria'
import { TipoLocal } from "../utils/Utils"
import { IsEnum } from 'class-validator'

@Entity()
export default class Local extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    numero!: number

    @Column({
        type: 'enum',
        enum: TipoLocal
    })
    @IsEnum(TipoLocal, { message: 'Tipo de local inválido' })
    tipo!: TipoLocal

    @OneToMany(() => Monitoria, monitoria => monitoria.local)
    monitorias!: Monitoria[]
}