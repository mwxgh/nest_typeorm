import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import AbstractService from '@/shared/services/abstract.service'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { PageDto } from '@/shared/common/dto'
import { Direction } from '@/constants'
import { trim } from 'lodash'
import {
  CategoriesPageOptionsDto,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto'
import { CategoryRelationService } from './category-relation.service'

@Injectable()
export class CategoryService extends AbstractService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryRelationService: CategoryRelationService,
    private readonly dataSource: DataSource,
  ) {
    super(categoryRepository)
  }

  async customCreate({
    userId,
    body,
  }: {
    userId: number
    body: CreateCategoryDto
  }) {
    body.parentId && (await this.validateExist({ id: body.parentId }))

    const data = Object.assign(body, {
      slug: await this.generateSlug(body.name),
    })

    await this.save({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  async findById(id: number): Promise<Category> {
    const category = await this.findOneBy({ id })

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} was not found.`)
    }

    return category
  }

  private buildQueryList(
    pageOptionsDto: CategoriesPageOptionsDto,
  ): SelectQueryBuilder<Category> {
    const { parentId, order, orderBy, q } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<Category> =
      this.categoryRepository.createQueryBuilder('category')

    if (parentId) {
      queryBuilder.where({ parentId })
    }
    if (q) {
      queryBuilder.searchByString(trim(q), ['category.name'])
    }

    return queryBuilder.orderBy(
      `category.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getList(optionsDto: CategoriesPageOptionsDto): Promise<CategoryDto[]> {
    const categories: Category[] =
      await this.buildQueryList(optionsDto).getMany()

    return categories.toDtos()
  }

  async getWithPaginate(
    pageOptionsDto: CategoriesPageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    const queryBuilder: SelectQueryBuilder<Category> =
      this.buildQueryList(pageOptionsDto)

    const [categories, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return categories.toPageDto(pageMeta)
  }

  async getById(id: number): Promise<CategoryDto> {
    return (await this.findById(id)).toDto()
  }

  async customUpdate({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateCategoryDto
  }): Promise<void> {
    const category: Category = await this.findById(id)

    if (body.parentId) {
      await this.validateExist({ id: body.parentId })

      const categoryDescendants = await this.buildDescendants(body.parentId)

      const uniqueParentIds = [
        ...new Set(
          categoryDescendants
            .map((category) => category.parentId)
            .filter((id) => id !== null),
        ),
      ]

      if (uniqueParentIds.includes(body.parentId)) {
        throw new BadRequestException(
          'Cannot update circular relative category',
        )
      }
    }

    if (body.name)
      Object.assign(body, {
        slug: await this.generateSlug(body.name),
      })

    await this.updateBy(category.id, { ...body, updatedBy: userId })
  }

  private async buildDescendants(rootId: number): Promise<Category[]> {
    const data: Category[] = await this.categoryRepository.query(
      `
      WITH RECURSIVE category_hierarchy AS (
          SELECT id,
              parent_id AS parentId,
              name,
              slug,
              status
          FROM categories
          WHERE id = ?
          UNION ALL
          SELECT c.id,
              c.parent_id AS parentId,
              c.name,
              c.slug,
              c.status
          FROM categories c
              INNER JOIN category_hierarchy ch ON c.parent_id = ch.id
      )
      SELECT id,
          parentId,
          name,
          slug,
          status
      FROM category_hierarchy
      `,
      [rootId],
    )

    return this.convertToEntities(data, Category)
  }

  async getDescendants(rootId: number): Promise<CategoryDto[]> {
    const data: Category[] = await this.buildDescendants(rootId)

    return data.toDtos()
  }

  async deleteBy({ id }: { id: number }): Promise<void> {
    await this.existsBy({ id })

    try {
      await this.dataSource.transaction(async (entityManager) => {
        await entityManager.softDelete(Category, { id: id })

        await this.categoryRelationService.unassignRelations({
          categoryIds: [id],
          entityManager,
        })
      })
    } catch (error) {
      throw new Error(`Error during category deletion process`)
    }
  }
}
