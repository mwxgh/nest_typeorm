import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { EntityConstant } from '@/constants/entity.constant'
import { Constructor } from './type/constructor'
import { AbstractDto, AbstractDtoWithCU } from './dto'

export type IAbstractEntity<DTO extends AbstractDto, O = never> = {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  createdBy?: number
  updatedBy?: number

  toDto(options?: O): DTO
}

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O = never,
> implements IAbstractEntity<DTO, O>
{
  @PrimaryGeneratedColumn('increment', { type: 'int', unsigned: true })
  id: number

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    precision: EntityConstant.TimePrecision,
    default: () => 'NOW()',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    precision: EntityConstant.TimePrecision,
    onUpdate: 'NOW()',
    default: () => 'NOW()',
  })
  updatedAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    precision: EntityConstant.TimePrecision,
  })
  deletedAt: Date

  private dtoClass?: Constructor<DTO, [AbstractEntity, O?]>

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass

    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      )
    }

    return new dtoClass(this, options)
  }
}

export abstract class AbstractEntityWithCU<
  DTO extends AbstractDtoWithCU = AbstractDtoWithCU,
  O = never,
> extends AbstractEntity<DTO, O> {
  @Column({
    name: 'created_by',
    type: 'int',
    nullable: true,
    unsigned: true,
  })
  createdBy: number

  @Column({
    name: 'updated_by',
    type: 'int',
    nullable: true,
    unsigned: true,
  })
  updatedBy: number
}
