import { BaseStatusEnum, EntityConstant } from '@/constants'
import {
  EnumField,
  NumberFieldOptional,
  StringField,
} from '@/shared/decorators'

export class CreateCategoryDto {
  @StringField({ maxLength: EntityConstant.EntityNameLength })
  readonly name: string

  @NumberFieldOptional({ default: null })
  readonly parentId?: number

  @EnumField(() => BaseStatusEnum, {
    default: BaseStatusEnum.Active,
  })
  readonly status: BaseStatusEnum
}
