import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  ContentPriorityList,
  ContentStatusList,
  ContentTypeList,
} from '@/constants'
import { AbstractDtoWithCU } from '@/shared/common/dto'
import { Content } from '../entities/content.entity'
import { CategoryDto } from '@/modules/category/dto/category.dto'

export class ContentDto extends AbstractDtoWithCU {
  @Expose()
  @ApiProperty()
  title: string

  @Expose()
  @ApiProperty()
  slug: string

  @Expose()
  @ApiProperty()
  summary: string

  @Expose()
  @ApiProperty()
  detail: string

  @Expose()
  @ApiProperty()
  status: string

  @Expose()
  @ApiProperty()
  priority: string

  @Expose()
  @ApiProperty()
  type: string

  @Expose()
  @ApiProperty()
  releasedBy: number

  @Expose()
  @ApiProperty()
  releasedAt: Date

  @Expose()
  @ApiProperty()
  expiredAt: Date

  @Expose()
  @ApiProperty({ type: () => CategoryDto, isArray: true })
  categories: CategoryDto[]

  constructor(content: Content) {
    super(content)

    this.title = content.title
    this.slug = content.slug
    this.summary = content.summary
    this.detail = content.detail
    this.status = ContentStatusList[content.status]
    this.priority = ContentPriorityList[content.priority]
    this.type = ContentTypeList[content.type]
    this.createdBy = content.createdBy
    this.updatedBy = content.updatedBy
    this.releasedBy = content.releasedBy
    this.releasedAt = content.releasedAt
    this.expiredAt = content.expiredAt
    this.categories = content.categoryRelations?.map((relation) =>
      relation.category.toDto(),
    )
  }
}
