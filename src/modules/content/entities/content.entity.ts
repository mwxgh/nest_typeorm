import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import {
  ContentPriorityEnum,
  ContentStatusEnum,
  ContentTypeEnum,
  EntityConstant,
} from '@/constants'
import { AbstractEntity, IAbstractEntity } from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { ContentDto } from '../dto/content.dto'
import { User } from '@/modules/user/entities/user.entity'

@Entity('contents')
@UseDto(ContentDto)
@Index(['slug'], { unique: true })
export class Content
  extends AbstractEntity<ContentDto>
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
  })
  releasedAt: Date

  @Column({
    name: 'expired_at',
    type: 'datetime',
    precision: EntityConstant.TimePrecision,
  })
  expiredAt: Date

  @ManyToOne(() => User, (user) => user.createdContents)
  @JoinColumn({ name: 'created_by' })
  creator: User

  @ManyToOne(() => User, (user) => user.releasedContents)
  @JoinColumn({ name: 'released_by' })
  releaser: User
}
