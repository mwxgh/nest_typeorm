import { PageOptionsDto } from '@/shared/common/dto/page-options.dto'
import { NumberFieldOptional } from '@/shared/decorators'

export class CategoriesPageOptionsDto extends PageOptionsDto {
  public static entity = 'Category'

  @NumberFieldOptional()
  readonly parentId?: number
}
