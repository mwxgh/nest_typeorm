import { ReactionTypeEnum } from '@/constants'
import { EnumField } from '@/shared/decorators'

export class UpdateReactionDto {
  @EnumField(() => ReactionTypeEnum, {
    default: ReactionTypeEnum.Love,
  })
  readonly type: ReactionTypeEnum
}
