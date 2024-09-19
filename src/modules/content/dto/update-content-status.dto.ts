import { PickType } from '@nestjs/swagger'
import { CreateContentDto } from './create-content.dto'

export class UpdateContentStatusDto extends PickType(CreateContentDto, [
  'status',
] as const) {}
