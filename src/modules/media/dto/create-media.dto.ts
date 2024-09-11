import { BaseStatusEnum } from '@/constants'
import { EnumField, StringFieldOptional } from '@/shared/decorators'

export class CreateMediaDto {
  @StringFieldOptional()
  readonly dimension?: any

  @EnumField(() => BaseStatusEnum)
  readonly status: BaseStatusEnum
}
