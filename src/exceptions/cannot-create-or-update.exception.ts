import { BadRequestException } from '@nestjs/common'
import { ValidationMessage } from '@/messages'

export class CannotCreateOrUpdateException extends BadRequestException {
  constructor(field: string, error?: string) {
    super(
      ValidationMessage.cannotCreateOrUpdate.replace('$field', field),
      error,
    )
  }
}
