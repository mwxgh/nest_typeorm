import { PageOptionsDto } from '@/shared/common/dto/page-options.dto'
import { EscapeString, StringFieldOptional } from '@/shared/decorators'

export class UsersPageOptionsDto extends PageOptionsDto {
  public static entity = 'User'

  @StringFieldOptional()
  @EscapeString()
  readonly role?: string
}
