import { PickType } from '@nestjs/swagger'
import { CreateContentDto } from './create-content.dto'

export class UpdateContentPriorityDto extends PickType(CreateContentDto, [
  'priority',
] as const) {}
