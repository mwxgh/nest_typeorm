import { BadRequestException } from '@nestjs/common'
import { ValidationMessage } from '@/messages'

export class LoginFailException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationMessage.loginFail, error)
  }
}
