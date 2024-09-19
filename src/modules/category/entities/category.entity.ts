import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'
import { BaseStatusEnum, EntityConstant } from '@/constants'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { CategoryDto } from '../dto/category.dto'
import { CategoryRelation } from './category-relation.entity'

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
  parentId?: number

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

  // Self-referencing relationship for parent
  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: 'SET NULL',
  })
  parent: Category

  // Self-referencing relationship for children
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[]

  @OneToMany(
    () => CategoryRelation,
    (categoryRelation) => categoryRelation.category,
  )
  categoryRelations: CategoryRelation[]
}
