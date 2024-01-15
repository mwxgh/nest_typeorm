import { User } from '@/modules/user/entities/user.entity'
import { StringField } from '@/shared/decorators'

export class UserLoginDto {
  public static readonly entity = User.name

  @StringField()
  readonly username: string

  @StringField()
  readonly password: string
}
