import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { ReactionTypeEnum } from '@/constants'
import { AbstractDto } from '@/shared/common/dto'
import { Reaction } from '../entities/reaction.entity'
import { UserDto } from '@/modules/user/dto'

export class ReactionDto extends AbstractDto {
  @Expose()
  @ApiProperty()
  createdBy: number

  @Expose()
  @ApiProperty()
  contentId: number

  @Expose()
  @ApiProperty()
  commentId: number

  @Expose()
  @ApiProperty()
  type: string

  @Expose()
  @ApiProperty({ type: () => UserDto })
  reactor?: UserDto

  constructor(reaction: Reaction) {
    super(reaction)

    this.createdBy = reaction.createdBy
    this.contentId = reaction.contentId
    this.commentId = reaction.commentId
    this.type = ReactionTypeEnum[reaction.type]
    this.reactor = reaction.reactor?.toDto()
  }
}
