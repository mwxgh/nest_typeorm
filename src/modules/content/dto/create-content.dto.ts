import {
  ContentPriorityEnum,
  ContentStatusEnum,
  ContentTypeEnum,
} from '@/constants'
import {
  DateFieldOptional,
  EnumField,
  NumberFieldOptional,
  StringField,
} from '@/shared/decorators'
import { ApiProperty } from '@nestjs/swagger'

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

  @NumberFieldOptional({ each: true })
  @ApiProperty({ type: [Number], isArray: true, example: [1, 2] })
  readonly mediaIds: number[]

  @NumberFieldOptional({ each: true })
  @ApiProperty({ type: [Number], isArray: true, example: [3, 4] })
  readonly tagIds: number[]

  @NumberFieldOptional({ each: true })
  @ApiProperty({ type: [Number], isArray: true, example: [5, 6] })
  readonly categoryIds: number[]
}
