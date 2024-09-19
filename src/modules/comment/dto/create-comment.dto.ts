import { CommentPriorityEnum, CommentStatusEnum } from '@/constants'
import {
  EnumField,
  NumberField,
  NumberFieldOptional,
  StringField,
} from '@/shared/decorators'

export class CreateCommentDto {
  @NumberField()
  readonly contentId: number

  @NumberFieldOptional({ default: null })
  readonly parentId?: number

  @StringField()
  readonly detail: string

  @EnumField(() => CommentStatusEnum, {
    default: CommentStatusEnum.Accepted,
  })
  readonly status: CommentStatusEnum

  @EnumField(() => CommentPriorityEnum, {
    default: CommentPriorityEnum.High,
  })
  readonly priority: CommentPriorityEnum
}
