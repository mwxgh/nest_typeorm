import { Injectable, NotFoundException } from '@nestjs/common'
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
    const { parentId, name } = body

    parentId && (await this.validateExist({ parentId }))

    await this.validateDuplicate({ name })

    await this.save({
      ...body,
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
    const { name, order, orderBy } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<Category> =
      this.categoryRepository.createQueryBuilder('category')

    if (name) queryBuilder.where({ name })

    return queryBuilder.orderBy(
      `category.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getUsersPaginate(
    pageOptionsDto: CategoriesPageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    const queryBuilder: SelectQueryBuilder<Category> =
      this.buildQueryList(pageOptionsDto)

    const [users, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return users.toPageDto(pageMeta)
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
    const category = await this.findById(id)

    await this.updateBy(category.id, { ...body, updatedBy: userId })
  }

  async deleteCategoryById({ id }: { id: number }): Promise<void> {
    const user = await this.findById(id)

    await this.softDelete(user.id)
  }
}
