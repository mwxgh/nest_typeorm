import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CommentPriorityList, CommentStatusList } from '@/constants'
import { AbstractDtoWithCU } from '@/shared/common/dto'
import { Comment } from '../entities/comment.entity'

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
  children: any

  constructor(comment: Comment) {
    super(comment)

    this.contentId = comment.contentId
    this.parentId = comment.parentId
    this.detail = comment.detail
    this.status = CommentStatusList[comment.status]
    this.priority = CommentPriorityList[comment.priority]
    this.acceptedBy = comment.acceptedBy
    this.children = comment.children
  }
}
