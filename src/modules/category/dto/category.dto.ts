import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { CategoryStatusList } from '@/constants'
import { Category } from '../entities/category.entity'
import { AbstractDtoWithCU } from '@/shared/common/dto'

export class CategoryDto extends AbstractDtoWithCU {
  @Expose()
  @ApiProperty()
  parentId?: number

  @Expose()
  @ApiProperty()
  name: string

  @Expose()
  @ApiProperty()
  slug: string

  @Expose()
  @ApiProperty()
  status: string

  @Expose()
  @ApiProperty()
  children: any

  constructor(category: Category) {
    super(category)

    this.name = category.name
    this.slug = category.slug
    this.parentId = category.parentId
    this.status = CategoryStatusList[category.status]
    this.children = category.children
  }
}
