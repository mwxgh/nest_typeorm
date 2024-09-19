import { Entity, Column } from 'typeorm'
import { UseDto } from '@/shared/decorators'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { BaseStatusEnum, EntityConstant } from '@/constants'
import { MediaDto } from '../dto'

@Entity('media')
@UseDto(MediaDto)
export class Media
  extends AbstractEntityWithCU<MediaDto>
  implements IAbstractEntity<MediaDto>
{
  @Column({
    name: 'original_name',
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  originalName: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  filename: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  type: string // image, video, etc.

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  mimetype: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityLongLength,
  })
  url: string

  @Column({
    type: 'json',
    nullable: true,
  })
  properties: string

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: BaseStatusEnum.Active,
  })
  status: BaseStatusEnum
}
