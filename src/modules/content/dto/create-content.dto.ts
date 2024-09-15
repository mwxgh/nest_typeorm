import {
  ContentPriorityEnum,
  ContentStatusEnum,
  ContentTypeEnum,
} from '@/constants'
import { DateFieldOptional, EnumField, StringField } from '@/shared/decorators'

export class CreateContentDto {
  @StringField()
  readonly title: string

  @StringField()
  readonly summary: string

  @StringField()
  readonly detail: string

  @EnumField(() => ContentStatusEnum)
  readonly status: ContentStatusEnum

  @EnumField(() => ContentPriorityEnum)
  readonly priority: ContentPriorityEnum

  @EnumField(() => ContentTypeEnum)
  readonly type: ContentTypeEnum

  @DateFieldOptional()
  readonly releasedAt?: Date

  @DateFieldOptional()
  readonly expiredAt?: Date
}
