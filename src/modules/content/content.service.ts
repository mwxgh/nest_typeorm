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

@Injectable()
export class ContentService extends AbstractService<Content> {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
    private readonly categoryRelationService: CategoryRelationService,
    private readonly tagRelationService: TagRelationService,
    private readonly dataSource: DataSource,
  ) {
    super(contentRepository)
  }

  async createContent({
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
          await this.categoryRelationService.assignCategoryRelations({
            relationId: newContent.id,
            categoryIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (tagIds && tagIds.length > 0) {
          await this.tagRelationService.assignTagRelations({
            relationId: newContent.id,
            tagIds,
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

    console.log(mediaIds)
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

  async getContentsPaginate(
    pageOptionsDto: ContentsPageOptionsDto,
  ): Promise<PageDto<ContentDto>> {
    const queryBuilder: SelectQueryBuilder<Content> =
      this.buildQueryList(pageOptionsDto)

    const [contents, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return contents.toPageDto(pageMeta)
  }

  async findContentById(id: number): Promise<Content> {
    const content = await this.findOneBy({ id })

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} was not found.`)
    }

    return content
  }

  async findContentWithRelationById(id: number): Promise<Content> {
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
      .where('content.id = :id', { id })
      .getOne()

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} was not found.`)
    }

    return content
  }

  async getContentById(id: number): Promise<ContentDto> {
    return (await this.findContentWithRelationById(id)).toDto()
  }

  async updateContentById({
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
        ? await this.findContentWithRelationById(id)
        : await this.findContentById(id)

    const currentCategoryIds =
      content.categoryRelations?.map((i) => i.categoryId) || []

    const currentTagIds = content.tagRelations?.map((i) => i.tagId) || []

    const assignCategoryIds = categoryIds
      ? difference(categoryIds, currentCategoryIds)
      : []
    const unassignCategoryIds = categoryIds
      ? difference(currentCategoryIds, categoryIds)
      : []

    const assignTagIds = tagIds ? difference(tagIds, currentTagIds) : []
    const unassignTagIds = tagIds ? difference(currentTagIds, tagIds) : []

    try {
      await this.dataSource.transaction(async (entityManager) => {
        if (assignCategoryIds.length > 0) {
          await this.categoryRelationService.assignCategoryRelations({
            relationId: content.id,
            categoryIds: assignCategoryIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (unassignCategoryIds.length > 0) {
          await this.categoryRelationService.unassignCategoryRelations({
            relationId: content.id,
            categoryIds: unassignCategoryIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (assignTagIds.length > 0) {
          await this.tagRelationService.assignTagRelations({
            relationId: content.id,
            tagIds: assignTagIds,
            type: RelationTypeEnum.Content,
            entityManager,
          })
        }

        if (unassignTagIds.length > 0) {
          await this.tagRelationService.unassignTagRelations({
            relationId: content.id,
            tagIds: unassignTagIds,
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
    console.log(mediaIds)
  }

  async updatePropertyContentById({
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
    const content = await this.findContentById(id)

    await this.updateBy({ id: content.id }, { ...body, updatedBy: userId })
  }

  async deleteCategoryById({ id }: { id: number }): Promise<void> {
    const content = await this.findContentById(id)

    await this.dataSource.transaction(async (entityManager) => {
      await entityManager.softDelete(Content, { id: content.id })

      await this.categoryRelationService.unassignCategoryRelations({
        relationId: content.id,
        type: RelationTypeEnum.Content,
        entityManager,
      })

      await this.tagRelationService.unassignTagRelations({
        relationId: content.id,
        type: RelationTypeEnum.Content,
        entityManager,
      })
    })
  }
}
