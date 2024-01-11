import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class CsvImportResultDto {
  @Expose()
  @ApiProperty()
  newRecords: number

  @Expose()
  @ApiProperty()
  editedRecords: number

  @Expose()
  @ApiProperty()
  deletedRecords: number

  @Expose()
  @ApiProperty()
  failedRecords: number

  @Expose()
  @ApiProperty({ nullable: true })
  key?: string
}
