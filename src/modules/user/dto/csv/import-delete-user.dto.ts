import { DateField } from '@/shared/decorators'
import { ImportUpdateUserDto } from './import-update-user.dto'

export class ImportDeleteUserDto extends ImportUpdateUserDto {
  @DateField()
  deletedAt: Date
}
