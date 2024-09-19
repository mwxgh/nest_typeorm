import { Column, Entity, Index } from 'typeorm'
import { EntityConstant, BaseStatusEnum } from '@/constants'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { TagDto } from '../dto'

@Entity('tags')
@UseDto(TagDto)
@Index(['slug'], { unique: true })
export class Tag
  extends AbstractEntityWithCU<TagDto>
  implements IAbstractEntity<TagDto>
{
  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  name: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  slug: string

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: BaseStatusEnum.Active,
  })
  status: BaseStatusEnum
}
