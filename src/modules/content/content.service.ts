import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Content } from './entities/content.entity'
import AbstractService from '@/shared/services/abstract.service'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { difference, trim } from 'lodash'
import { Direction, RelationTypeEnum } from '@/constants'
import { PageDto } from '@/shared/common/dto'
import { CategoryRelationService } from '../category/category-relation.service'
import {
  ContentDto,
  ContentsPageOptionsDto,
  CreateContentDto,
  UpdateContentDto,
  UpdateContentPriorityDto,
  UpdateContentStatusDto,
  UpdateContentTypeDto,
} from './dto'
import { TagRelationService } from '../tag/tag-relation.service'
import { MediaRelationService } from '../media/media-relation.service'
import { CommentService } from '../comment/comment.service'

@Injectable()
export class ContentService extends AbstractService<Content> {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly categoryRelationService: CategoryRelationService,
    private readonly tagRelationService: TagRelationService,
    private readonly mediaRelationService: MediaRelationService,
    private readonly commentService: CommentService,
    private readonly dataSource: DataSource,
  ) {
    super(contentRepository)
  }

  async customCreate({
    userId,
    body,
  }: {
    userId: number
    body: CreateContentDto
  }): Promise<void> {
    const { mediaIds, tagIds, categoryIds, ...data } = body

    Object.assign(data, {
      slug: await this.generateSlug(body.title),
    })

    try {
      await this.dataSource.transaction(async (entityManager) => {
        const newContent = await entityManager.save(Content, {
          ...data,
          createdBy: userId,
        })

        if (categoryIds && categoryIds.length > 0) {
          await this.categoryRelationService.assignRelations({
            relationId: newContent.id,
            categoryIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (tagIds && tagIds.length > 0) {
          await this.tagRelationService.assignRelations({
            relationId: newContent.id,
            tagIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (mediaIds && mediaIds.length > 0) {
          await this.mediaRelationService.assignRelations({
            relationId: newContent.id,
            mediaIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }
      })
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create content. ${error}`,
      )
    }
  }

  private buildQueryList(
    pageOptionsDto: ContentsPageOptionsDto,
  ): SelectQueryBuilder<Content> {
    const { title, order, orderBy, q } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<Content> =
      this.contentRepository.createQueryBuilder('content')

    if (title) {
      queryBuilder.where({ title })
    }
    if (q) {
      queryBuilder.searchByString(trim(q), ['content.slug', 'content.summary'])
    }

    return queryBuilder.orderBy(
      `content.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getWithPaginate(
    pageOptionsDto: ContentsPageOptionsDto,
  ): Promise<PageDto<ContentDto>> {
    const queryBuilder: SelectQueryBuilder<Content> =
      this.buildQueryList(pageOptionsDto)

    const [contents, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return contents.toPageDto(pageMeta)
  }

  async findById(id: number): Promise<Content> {
    const content = await this.findOneBy({ id })

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} was not found.`)
    }

    return content
  }

  async findWithRelationById(id: number): Promise<Content> {
    const content = await this.contentRepository
      .createQueryBuilder('content')

      .leftJoinAndSelect('content.categoryRelations', 'cc', 'cc.type = :type', {
        type: RelationTypeEnum.Content,
      })
      .leftJoinAndSelect('cc.category', 'category')

      .leftJoinAndSelect('content.tagRelations', 'ct', 'ct.type = :type', {
        type: RelationTypeEnum.Content,
      })
      .leftJoinAndSelect('ct.tag', 'tag')

      .leftJoinAndSelect('content.mediaRelations', 'cm', 'cm.type = :type', {
        type: RelationTypeEnum.Content,
      })
      .leftJoinAndSelect('cm.media', 'media')

      .leftJoinAndSelect('content.comments', 'rc', 'rc.parentId IS NULL') // Fetch root comments
      .leftJoinAndSelect('rc.children', 'rcc') // Fetch one level of child comments
      .where('content.id = :contentId', { contentId: id })

      .where('content.id = :id', { id })
      .getOne()

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} was not found.`)
    }

    return content
  }

  async getById(id: number): Promise<ContentDto> {
    return (await this.findWithRelationById(id)).toDto()
  }

  async customUpdate({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateContentDto
  }): Promise<void> {
    const { mediaIds, tagIds, categoryIds, ...data } = body

    if (data.title)
      Object.assign(data, {
        slug: await this.generateSlug(data.title),
      })

    const content =
      mediaIds || tagIds || categoryIds
        ? await this.findWithRelationById(id)
        : await this.findById(id)

    const currentCategoryIds =
      content.categoryRelations?.map((i) => i.categoryId) || []

    const currentTagIds = content.tagRelations?.map((i) => i.tagId) || []

    const currentMediaIds = content.mediaRelations?.map((i) => i.mediaId) || []

    const assignCategoryIds = categoryIds
      ? difference(categoryIds, currentCategoryIds)
      : []
    const unassignCategoryIds = categoryIds
      ? difference(currentCategoryIds, categoryIds)
      : []

    const assignTagIds = tagIds ? difference(tagIds, currentTagIds) : []
    const unassignTagIds = tagIds ? difference(currentTagIds, tagIds) : []

    const assignMediaIds = mediaIds ? difference(mediaIds, currentMediaIds) : []
    const unassignMediaIds = mediaIds
      ? difference(currentMediaIds, mediaIds)
      : []

    try {
      await this.dataSource.transaction(async (entityManager) => {
        if (assignCategoryIds.length > 0) {
          await this.categoryRelationService.assignRelations({
            relationId: content.id,
            categoryIds: assignCategoryIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (unassignCategoryIds.length > 0) {
          await this.categoryRelationService.unassignRelations({
            relationId: content.id,
            categoryIds: unassignCategoryIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (assignTagIds.length > 0) {
          await this.tagRelationService.assignRelations({
            relationId: content.id,
            tagIds: assignTagIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (unassignTagIds.length > 0) {
          await this.tagRelationService.unassignRelations({
            relationId: content.id,
            tagIds: unassignTagIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (assignMediaIds.length > 0) {
          await this.mediaRelationService.assignRelations({
            relationId: content.id,
            mediaIds: assignMediaIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (unassignMediaIds.length > 0) {
          await this.mediaRelationService.unassignRelations({
            relationId: content.id,
            mediaIds: unassignMediaIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        await entityManager.update(
          Content,
          { id: content.id },
          {
            ...data,
            updatedBy: userId,
          },
        )
      })
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update content. ${error}`,
      )
    }
  }

  async updatePropertyById({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body:
      | UpdateContentStatusDto
      | UpdateContentTypeDto
      | UpdateContentPriorityDto
  }): Promise<void> {
    const content = await this.findById(id)

    await this.updateBy({ id: content.id }, { ...body, updatedBy: userId })
  }

  async deleteBy({ id }: { id: number }): Promise<void> {
    const content = await this.findById(id)

    await this.dataSource.transaction(async (entityManager) => {
      await entityManager.softDelete(Content, { id: content.id })

      await this.commentService.deleteContentCascade({
        contentId: content.id,
        entityManager,
      })

      await this.categoryRelationService.unassignRelations({
        relationId: content.id,
        type: RelationTypeEnum.Content,
        entityManager,
      })

      await this.tagRelationService.unassignRelations({
        relationId: content.id,
        type: RelationTypeEnum.Content,
        entityManager,
      })

      await this.mediaRelationService.unassignRelations({
        relationId: content.id,
        type: RelationTypeEnum.Content,
        entityManager,
      })
    })
  }
}
