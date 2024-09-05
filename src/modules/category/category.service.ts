import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import AbstractService from '@/shared/services/abstract.service'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { CategoryDto } from './dto/category.dto'
import { PageDto } from '@/shared/common/dto'
import { CategoriesPageOptionsDto } from './dto/categories-page-options.dto'
import { CategoryStatusList, Direction } from '@/constants'
import { trim } from 'lodash'

@Injectable()
export class CategoryService extends AbstractService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(categoryRepository)
  }

  async createCategory({
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

  async getCategories(
    optionsDto: CategoriesPageOptionsDto,
  ): Promise<CategoryDto[]> {
    const categories: Category[] =
      await this.buildQueryList(optionsDto).getMany()

    return categories.toDtos()
  }

  async getCategoriesPaginate(
    pageOptionsDto: CategoriesPageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    const queryBuilder: SelectQueryBuilder<Category> =
      this.buildQueryList(pageOptionsDto)

    const [categories, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return categories.toPageDto(pageMeta)
  }

  async getCategoryById(id: number): Promise<CategoryDto> {
    return (await this.findById(id)).toDto()
  }

  async updateCategoryById({
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

      const categoryDescendants = await this.buildCategoryDescendants(
        body.parentId,
      )

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

  buildCategoryTree(
    categories: Category[],
    parentId: number | null = null,
  ): CategoryDto[] {
    return categories
      .filter((category) => category.parentId === parentId)
      .map((category) => ({
        ...category,
        status: CategoryStatusList[category.status],
        children: this.buildCategoryTree(categories, category.id),
      }))
  }

  async getCategoryTree(rootId: number): Promise<CategoryDto[]> {
    const categories = await this.buildCategoryDescendants(rootId)
    return this.buildCategoryTree(categories)
  }

  async buildCategoryDescendants(rootId: number): Promise<Category[]> {
    const data: Category[] = await this.categoryRepository.query(
      `
      WITH RECURSIVE category_hierarchy AS (
        SELECT id, parent_id AS parentId, name, slug, status
        FROM categories
        WHERE id = ?

        UNION ALL

        SELECT c.id, c.parent_id AS parentId, c.name, c.slug, c.status
        FROM categories c
        INNER JOIN category_hierarchy ch ON c.parent_id = ch.id
      )

      SELECT id, parentId, name, slug, status
      FROM category_hierarchy
      `,
      [rootId],
    )

    return data
  }

  async getCategoryDescendants(rootId: number): Promise<CategoryDto[]> {
    const data: Category[] = await this.buildCategoryDescendants(rootId)

    return data.map((category) => ({
      ...category,
      status: CategoryStatusList[category.status],
    }))
  }

  async deleteCategoryById({ id }: { id: number }): Promise<void> {
    const category = await this.findById(id)

    await this.softDelete(category.id)
  }
}
