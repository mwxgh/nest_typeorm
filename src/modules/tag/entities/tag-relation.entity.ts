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
import { Tag } from './tag.entity'

@Entity('tag_relations')
@Index(['tagId', 'relationId', 'type'], { unique: true })
export class TagRelation {
  @PrimaryColumn({ name: 'tag_id', type: 'int', unsigned: true })
  tagId: number

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

  @ManyToOne(() => Tag, (tag) => tag.tagRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: Tag

  @ManyToOne(() => Content, (content) => content.tagRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'relation_id' })
  content: Content
}
