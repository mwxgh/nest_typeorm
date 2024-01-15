import { BadRequestException } from '@nestjs/common'
import { ValidationMessage } from '@/messages'

export class InvalidFileTypeException extends BadRequestException {
  constructor(error?: string) {
    super(ValidationMessage.invalidFileType, error)
  }
}
