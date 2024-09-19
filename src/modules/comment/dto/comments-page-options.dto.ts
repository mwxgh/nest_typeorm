import { CommentPriorityEnum, CommentStatusEnum } from '@/constants'
import { PageOptionsDto } from '@/shared/common/dto/page-options.dto'
import { EnumFieldOptional, NumberFieldOptional } from '@/shared/decorators'

export class CommentsPageOptionsDto extends PageOptionsDto {
  public static entity = 'Comment'

  @NumberFieldOptional()
  readonly contentId?: number

  @NumberFieldOptional()
  readonly parentId?: number

  @EnumFieldOptional(() => CommentStatusEnum)
  readonly status?: CommentStatusEnum

  @EnumFieldOptional(() => CommentPriorityEnum)
  readonly priority?: CommentPriorityEnum
}
