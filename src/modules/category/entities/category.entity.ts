import { Exclude } from 'class-transformer'
import { Column, Entity, Index } from 'typeorm'
import { CategoryStatusEnum, EntityConstant } from '@/constants'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { CategoryDto } from '../dto/category.dto'

@Entity('categories')
@UseDto(CategoryDto)
@Index(['slug'], { unique: true })
export class Category
  extends AbstractEntityWithCU<CategoryDto>
  implements IAbstractEntity<CategoryDto>
{
  @Column({
    name: 'parent_id',
    nullable: true,
    type: 'int',
  })
  @Exclude()
  parentId: number

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
    default: CategoryStatusEnum.Active,
  })
  status: CategoryStatusEnum
}
