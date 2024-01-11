import { NumberField } from '@/shared/decorators'

export class ResetPasswordDto {
  @NumberField()
  readonly userId: number
}
