import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import {
  ContentPriorityEnum,
  ContentStatusEnum,
  ContentTypeEnum,
  EntityConstant,
} from '@/constants'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { User } from '@/modules/user/entities/user.entity'
import { CategoryRelation } from '@/modules/category/entities/category-relation.entity'
import { ContentDto } from '../dto'
import { TagRelation } from '@/modules/tag/entities/tag-relation.entity'
import { MediaRelation } from '@/modules/media/entities/media-relation.entity'
import { Comment } from '@/modules/comment/entities/comment.entity'

@Entity('contents')
@UseDto(ContentDto)
@Index(['slug'], { unique: true })
export class Content
  extends AbstractEntityWithCU<ContentDto>
  implements IAbstractEntity<ContentDto>
{
  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  title: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  slug: string

  @Column({
    type: 'varchar',
    length: EntityConstant.EntityShortLength,
  })
  summary: string

  @Column({
    type: 'text',
  })
  detail: string

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: ContentStatusEnum.Draft,
  })
  status: ContentStatusEnum

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: ContentPriorityEnum.Medium,
  })
  priority: ContentPriorityEnum

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: ContentTypeEnum.Article,
  })
  type: ContentTypeEnum

  @Column({
    name: 'created_by',
    type: 'int',
    unsigned: true,
  })
  createdBy: number

  @Column({
    name: 'released_by',
    type: 'int',
    nullable: true,
    unsigned: true,
  })
  releasedBy: number

  @Column({
    name: 'released_at',
    type: 'datetime',
    precision: EntityConstant.TimePrecision,
    default: () => 'NOW()',
  })
  releasedAt: Date

  @Column({
    name: 'expired_at',
    type: 'datetime',
    precision: EntityConstant.TimePrecision,
    nullable: true,
  })
  expiredAt: Date

  @ManyToOne(() => User, (user) => user.createdContents)
  @JoinColumn({ name: 'created_by' })
  creator: User

  @ManyToOne(() => User, (user) => user.releasedContents)
  @JoinColumn({ name: 'released_by' })
  releaser: User

  @OneToMany(
    () => CategoryRelation,
    (categoryRelation) => categoryRelation.content,
  )
  categoryRelations: CategoryRelation[]

  @OneToMany(() => TagRelation, (tagRelation) => tagRelation.content)
  tagRelations: TagRelation[]

  @OneToMany(() => MediaRelation, (mediaRelation) => mediaRelation.content)
  mediaRelations: MediaRelation[]

  @OneToMany(() => Comment, (comment) => comment.content)
  comments: Comment[]
}
