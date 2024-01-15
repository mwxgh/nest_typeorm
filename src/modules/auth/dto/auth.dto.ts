import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'

export class AuthDto {
  @ApiProperty()
  @Expose()
  @Transform((value) => parseInt(value.value))
  id: number

  @ApiProperty()
  @Expose()
  @Transform((value) => parseInt(value.value))
  role: number

  @ApiProperty()
  @Expose()
  sessionId: string
}
