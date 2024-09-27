import { BaseStatusEnum } from '@/constants'
import {
  ClassFieldOptional,
  EnumField,
  NumberFieldOptional,
} from '@/shared/decorators'

class MediaPropertiesDto {
  @NumberFieldOptional()
  readonly width?: number

  @NumberFieldOptional()
  readonly height?: number
}
export class CreateMediaDto {
  @ClassFieldOptional({ type: () => MediaPropertiesDto, isArray: false }) //StringFieldOptional for test with Postman
  readonly properties?: MediaPropertiesDto

  @EnumField(() => BaseStatusEnum, {
    default: BaseStatusEnum.Active,
  })
  readonly status: BaseStatusEnum
}
