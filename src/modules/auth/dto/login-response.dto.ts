import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class LoginResponseDto {
  @ApiProperty()
  @Expose()
  userId: number

  @ApiProperty()
  @Expose()
  readonly token: string
}
