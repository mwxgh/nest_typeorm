import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { ReactionTypeEnum } from '@/constants'
import { AbstractEntity, IAbstractEntity } from '@/shared/common/base.entity'
import { UseDto } from '@/shared/decorators'
import { User } from '@/modules/user/entities/user.entity'
import { Content } from '@/modules/content/entities/content.entity'
import { ReactionDto } from '../dto'
import { Comment } from '@/modules/comment/entities/comment.entity'

@Entity('reactions')
@UseDto(ReactionDto)
export class Reaction
  extends AbstractEntity<ReactionDto>
  implements IAbstractEntity<ReactionDto>
{
  @Column({
    name: 'created_by',
    type: 'int',
    unsigned: true,
  })
  createdBy: number

  @Column({
    name: 'content_id',
    type: 'int',
    unsigned: true,
  })
  contentId: number

  @Column({
    name: 'comment_id',
    type: 'int',
    unsigned: true,
    nullable: true,
  })
  commentId: number

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: ReactionTypeEnum.Like,
  })
  type: ReactionTypeEnum

  @ManyToOne(() => User, (user) => user.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  reactor: User

  @ManyToOne(() => Content, (content) => content.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'content_id' })
  content: Content

  @ManyToOne(() => Comment, (comment) => comment.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment
}
