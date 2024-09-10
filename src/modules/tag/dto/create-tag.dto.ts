import { TagStatusEnum, EntityConstant } from '@/constants'
import { EnumField, StringField } from '@/shared/decorators'

export class CreateTagDto {
  @StringField({ maxLength: EntityConstant.EntityNameLength })
  readonly name: string

  @EnumField(() => TagStatusEnum)
  readonly status: TagStatusEnum
}
