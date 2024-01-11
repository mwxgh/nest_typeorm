import { OmitType } from '@nestjs/swagger'
import { StringField } from '@/shared/decorators'
import { ImportCreateUserDto } from './import-create-user.dto'

export class ImportUpdateUserDto extends OmitType(ImportCreateUserDto, [
  'role',
]) {
  @StringField()
  username: string
}
