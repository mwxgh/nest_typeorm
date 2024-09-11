import { PageOptionsDto } from '@/shared/common/dto/page-options.dto'
import { StringFieldOptional } from '@/shared/decorators'

export class MediaPageOptionsDto extends PageOptionsDto {
  public static entity = 'Media'

  @StringFieldOptional()
  readonly type?: string
}
