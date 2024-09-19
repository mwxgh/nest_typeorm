import { PickType } from '@nestjs/swagger'
import { CreateContentDto } from './create-content.dto'

export class UpdateContentTypeDto extends PickType(CreateContentDto, [
  'type',
] as const) {}
