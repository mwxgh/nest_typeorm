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
import { Direction } from '@/constants'
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
      throw new NotFoundException(`Category not found by id ${id}`)
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

    body.parentId && (await this.validateExist({ id: body.parentId }))

    const childCategories = await this.categoryRepository
      .createQueryBuilder('category')
      .where({ parentId: category.id })
      .select(['category.parentId'])
      .getMany()

    if (childCategories.length > 0) {
      const isParentIdIncluded = childCategories.some(
        (item) => item.parentId === body.parentId,
      )

      console.log(
        childCategories,
        isParentIdIncluded,
        'childCategories_____________',
      )
      if (isParentIdIncluded || body.parentId === id) {
        throw new BadRequestException(
          'Cannot update circular relative category',
        )
      }
    }

    console.log(userId)

    // await this.updateBy(category.id, { ...body, updatedBy: userId })
  }

  async deleteCategoryById({ id }: { id: number }): Promise<void> {
    const user = await this.findById(id)

    await this.softDelete(user.id)
  }
}
