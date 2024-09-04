import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TagStatusList } from '@/constants'
import { AbstractDtoWithCU } from '@/shared/common/dto'
import { Tag } from '../entities/tag.entity'

export class TagDto extends AbstractDtoWithCU {
  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  status: string

  @Expose()
  @ApiProperty()
  slug: string

  constructor(tag: Tag) {
    super(tag)

    this.name = tag.name
    this.slug = tag.slug
    this.status = TagStatusList[tag.status]
  }
}
