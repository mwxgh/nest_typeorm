import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CommentPriorityList, CommentStatusList } from '@/constants'
import { AbstractDtoWithCU } from '@/shared/common/dto'
import { Comment } from '../entities/comment.entity'
import { ReactionDto } from '@/modules/reaction/dto'
import { UserDto } from '@/modules/user/dto'

export class CommentDto extends AbstractDtoWithCU {
  @Expose()
  @ApiProperty()
  contentId: number

  @Expose()
  @ApiProperty()
  parentId?: number

  @Expose()
  @ApiProperty()
  detail: string

  @Expose()
  @ApiProperty()
  status: string

  @Expose()
  @ApiProperty()
  priority: string

  @Expose()
  @ApiProperty()
  acceptedBy: number

  @Expose()
  @ApiProperty()
  createdAt: Date

  @Expose()
  @ApiProperty()
  updatedAt: Date

  @Expose()
  @ApiProperty({ type: () => UserDto })
  creator?: UserDto

  @Expose()
  @ApiProperty({ type: () => ReactionDto, isArray: true })
  reactions: ReactionDto[]

  @Expose()
  @ApiProperty({ type: () => CommentDto, isArray: true })
  children?: CommentDto[]

  constructor(comment: Comment) {
    super(comment)

    this.contentId = comment.contentId
    this.parentId = comment.parentId
    this.detail = comment.detail
    this.status = CommentStatusList[comment.status]
    this.priority = CommentPriorityList[comment.priority]
    this.acceptedBy = comment.acceptedBy
    this.creator = comment.creator?.toDto() || undefined
    this.reactions = comment.reactions?.toDtos()
    this.children =
      comment.children?.map((child) => new CommentDto(child)) || undefined
  }
}
