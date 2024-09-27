import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { CommentPriorityEnum, CommentStatusEnum } from '@/constants'
import {
  AbstractEntityWithCU,
  IAbstractEntity,
} from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { CommentDto } from '../dto'
import { User } from '@/modules/user/entities/user.entity'
import { Content } from '@/modules/content/entities/content.entity'
import { Reaction } from '@/modules/reaction/entities/reaction.entity'

@Entity('comments')
@UseDto(CommentDto)
export class Comment
  extends AbstractEntityWithCU<CommentDto>
  implements IAbstractEntity<CommentDto>
{
  @Column({
    name: 'content_id',
    type: 'int',
    unsigned: true,
  })
  contentId: number

  @Column({
    name: 'parent_id',
    nullable: true,
    type: 'int',
    unsigned: true,
  })
  parentId?: number

  @Column({
    type: 'text',
  })
  detail: string

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: CommentStatusEnum.Accepted,
  })
  status: CommentStatusEnum

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: CommentPriorityEnum.High,
  })
  priority: CommentPriorityEnum

  @Column({
    name: 'accepted_by',
    type: 'int',
    nullable: true,
    unsigned: true,
  })
  acceptedBy: number

  @ManyToOne(() => User, (user) => user.createdComments)
  @JoinColumn({ name: 'created_by' })
  creator: User

  @ManyToOne(() => User, (user) => user.acceptedComments)
  @JoinColumn({ name: 'accepted_by' })
  acceptor: User

  @ManyToOne(() => Content, (content) => content.comments)
  @JoinColumn({ name: 'content_id' })
  content: Content

  @ManyToOne(() => Comment, (category) => category.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment

  // Reference to the parent-child relationship of Category (SET NULL)
  // When removing one comment, all child comments belonging to this comment must also be removed.

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[]

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions: Reaction[]
}
