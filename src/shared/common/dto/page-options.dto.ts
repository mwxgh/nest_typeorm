import { Direction } from '@/constants'
import {
  EnumFieldOptional,
  EscapeString,
  NumberFieldOptional,
  StringFieldOptional,
} from '@shared/decorators'

export class PageOptionsDto {
  @EnumFieldOptional(() => Direction, {
    default: Direction.ASC,
  })
  readonly order: Direction = Direction.ASC

  @NumberFieldOptional({
    minimum: 1,
    default: 1,
    int: true,
  })
  readonly page: number = 1

  @NumberFieldOptional({
    minimum: 1,
    maximum: 50,
    default: 50,
    int: true,
  })
  readonly take: number = 50

  @StringFieldOptional()
  @EscapeString()
  readonly q?: string

  @StringFieldOptional()
  @EscapeString()
  readonly orderBy?: string
}
