import { BadRequestException } from '@nestjs/common'
import { ValidationMessage } from '@/messages'

export class SignUpFailException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationMessage.signUpFail, error)
  }
}
