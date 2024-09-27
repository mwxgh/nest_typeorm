import { ReactionTypeEnum } from '@/constants'
import {
  EnumField,
  NumberField,
  NumberFieldOptional,
} from '@/shared/decorators'

export class CreateReactionDto {
  @NumberField()
  readonly contentId: number

  @NumberFieldOptional({ default: null })
  readonly commentId?: number

  @EnumField(() => ReactionTypeEnum, {
    default: ReactionTypeEnum.Like,
  })
  readonly type: ReactionTypeEnum
}
