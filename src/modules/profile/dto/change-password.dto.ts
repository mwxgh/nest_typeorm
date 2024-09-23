import { PasswordField } from '@/shared/decorators'

export class ChangePasswordDto {
  @PasswordField({ maxLength: 20 })
  readonly currentPassword: string

  @PasswordField({ maxLength: 20 })
  readonly newPassword: string
}
