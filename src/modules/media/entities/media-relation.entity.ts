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
import { Media } from './media.entity'

@Entity('media_relations')
@Index(['mediaId', 'relationId', 'type'], { unique: true })
export class MediaRelation {
  @PrimaryColumn({ name: 'media_id', type: 'int', unsigned: true })
  mediaId: number

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

  @ManyToOne(() => Media, (media) => media.mediaRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'media_id' })
  media: Media

  @ManyToOne(() => Content, (content) => content.mediaRelations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'relation_id' })
  content: Content
}
