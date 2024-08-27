import { PageOptionsDto } from '@/shared/common/dto/page-options.dto'
import { EscapeString, StringFieldOptional } from '@/shared/decorators'

export class CategoriesPageOptionsDto extends PageOptionsDto {
  public static entity = 'Category'

  @StringFieldOptional()
  @EscapeString()
  readonly name?: string
}
