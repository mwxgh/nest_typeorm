import { UnauthorizedException } from '@nestjs/common'
import { ValidationMessage } from '@/messages'

export class UserLoggedException extends UnauthorizedException {
  constructor(error?: string) {
    super(ValidationMessage.forceLogoutWhenLoginLater, error)
  }
}
