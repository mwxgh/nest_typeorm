import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform } from 'class-transformer'

export class JwtStrategyDto {
  @ApiProperty()
  @Expose()
  @Transform((value) => parseInt(value.value))
  sub: number

  @ApiProperty()
  @Expose()
  @Transform((value) => parseInt(value.value))
  role: number

  @ApiProperty()
  @Expose()
  username: string

  @ApiProperty()
  @Expose()
  email: string
}
