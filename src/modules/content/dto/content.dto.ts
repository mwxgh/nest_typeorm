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
import { TagDto } from '@/modules/tag/dto'
import { MediaDto } from '@/modules/media/dto'
import { CommentDto } from '@/modules/comment/dto'
import { ReactionDto } from '@/modules/reaction/dto'

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

  @Expose()
  @ApiProperty({ type: () => TagDto, isArray: true })
  tags: TagDto[]

  @Expose()
  @ApiProperty({ type: () => MediaDto, isArray: true })
  medias: MediaDto[]

  @Expose()
  @ApiProperty({ type: () => ReactionDto, isArray: true })
  reactions: ReactionDto[]

  @Expose()
  @ApiProperty({ type: () => CommentDto, isArray: true })
  comments: CommentDto[]

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
    this.tags = content.tagRelations?.map((relation) => relation.tag.toDto())
    this.medias = content.mediaRelations?.map((relation) =>
      relation.media.toDto(),
    )
    this.reactions = content.reactions?.toDtos()
    this.comments = content.comments?.toDtos()
  }
}
