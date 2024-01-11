import { ApiProperty } from '@nestjs/swagger'

import { NumberField } from '@/shared/decorators'

export class LockUserDto {
  @ApiProperty({ type: 'array', items: { type: 'number' } })
  @NumberField({ each: true, int: true, minSize: 1 })
  readonly ids: number[]
}
