import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ValidationMessage } from '@/messages'

@Injectable()
export class StringLengthPipe implements PipeTransform<string> {
  private readonly length: number
  private readonly propertyName: string

  constructor(options: { length: number; propertyName: string }) {
    this.length = options.length
    this.propertyName = options.propertyName
  }

  transform(value: string) {
    let msg: string = ''

    if (value.length < this.length) {
      msg = ValidationMessage.minLength
    }

    if (value.length > this.length) {
      msg = ValidationMessage.maxLength
    }

    if (msg) {
      throw new BadRequestException(
        msg
          .replace('$field', this.propertyName)
          .replace('$1', this.length.toString()),
      )
    }

    return value
  }
}
