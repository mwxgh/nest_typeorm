import { PageOptionsDto } from '@/shared/common/dto/page-options.dto'
import { StringFieldOptional } from '@/shared/decorators'

export class ContentsPageOptionsDto extends PageOptionsDto {
  public static entity = 'Content'

  @StringFieldOptional()
  readonly title?: string
}
