import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { isNumber } from 'class-validator'

@Injectable()
export class PositiveNumberPipe implements PipeTransform<string, number> {
  transform(value: any) {
    const val = parseInt(value, 10)

    if (!isNumber(value) || isNaN(val) || val < 0) {
      throw new NotFoundException()
    }

    return val
  }
}
