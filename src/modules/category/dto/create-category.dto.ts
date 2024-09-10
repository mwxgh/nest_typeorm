import { CategoryStatusEnum, EntityConstant } from '@/constants'
import {
  EnumField,
  NumberFieldOptional,
  StringField,
} from '@/shared/decorators'

export class CreateCategoryDto {
  @StringField({ maxLength: EntityConstant.EntityNameLength })
  readonly name: string

  @NumberFieldOptional()
  readonly parentId?: number

  @EnumField(() => CategoryStatusEnum)
  readonly status: CategoryStatusEnum
}
