import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { Media } from '../entities/media.entity'
import { AbstractDtoWithCU } from '@/shared/common/dto'
import { BaseStatusList } from '@/constants'

export class MediaDto extends AbstractDtoWithCU {
  @Expose()
  @ApiProperty()
  originalName: string

  @Expose()
  @ApiProperty()
  filename: string

  @Expose()
  @ApiProperty()
  type: string

  @Expose()
  @ApiProperty()
  mimetype: string

  @Expose()
  @ApiProperty()
  url: string

  @Expose()
  @ApiProperty()
  properties: any

  @Expose()
  @ApiProperty()
  status: string

  constructor(media: Media) {
    super(media)

    this.originalName = media.originalName
    this.filename = media.filename
    this.type = media.type
    this.mimetype = media.mimetype
    this.url = media.url
    this.properties = media.properties
    this.status = BaseStatusList[media.status]
  }
}
