import { EntityConstant, RelationTypeEnum } from '@/constants'
import { Content } from '@/modules/content/entities/content.entity'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import { Category } from './category.entity'

@Entity('category_relations')
@Index(['categoryId', 'relationId', 'type'], { unique: true })
export class CategoryRelation {
  @PrimaryColumn({ name: 'category_id', type: 'int', unsigned: true })
  categoryId: number

  @PrimaryColumn({ name: 'relation_id', type: 'int', unsigned: true })
  relationId: number

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: RelationTypeEnum.Content,
  })
  type: RelationTypeEnum

  @Column({
    name: 'assigned_at',
    type: 'datetime',
    precision: EntityConstant.TimePrecision,
    default: () => 'NOW()',
  })
  assignedAt: Date

  @ManyToOne(() => Category, (category) => category.categoryRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category

  @ManyToOne(() => Content, (content) => content.categoryRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'relation_id' })
  content: Content
}
