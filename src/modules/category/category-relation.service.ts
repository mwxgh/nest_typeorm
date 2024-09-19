import AbstractService from '@/shared/services/abstract.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CategoryRelation } from './entities/category-relation.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, In, Repository } from 'typeorm'
import { Category } from './entities/category.entity'
import { BaseStatusEnum, RelationTypeEnum } from '@/constants'

@Injectable()
export class CategoryRelationService extends AbstractService<CategoryRelation> {
  constructor(
    @InjectRepository(CategoryRelation)
    private readonly categoryRelationRepository: Repository<CategoryRelation>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    super(categoryRelationRepository)
  }

  async assignCategoryRelations({
    relationId,
    categoryIds,
    type,
    entityManager,
  }: {
    relationId: number
    categoryIds: number[]
    type: RelationTypeEnum
    entityManager?: EntityManager
  }): Promise<void> {
    const repository = entityManager
      ? entityManager.getRepository(CategoryRelation)
      : this.categoryRelationRepository

    const [categories, count] = await this.categoryRepository.findAndCountBy({
      id: In(categoryIds),
      status: BaseStatusEnum.Active,
    })

    if (count !== categoryIds.length) {
      throw new NotFoundException(`Category with any IDs was not found !`)
    }

    const contentCategories = []
    for (const category of categories) {
      const contentCategory = repository.create({
        relationId,
        categoryId: category.id,
        type,
      })
      contentCategories.push(contentCategory)
    }

    await repository.save(contentCategories)
  }

  async unassignCategoryRelations({
    relationId,
    categoryIds,
    type,
    entityManager,
  }: {
    relationId?: number
    categoryIds?: number[]
    type?: RelationTypeEnum
    entityManager?: EntityManager
  }): Promise<void> {
    const repository = entityManager
      ? entityManager.getRepository(CategoryRelation)
      : this.categoryRelationRepository

    await repository.delete({
      ...(relationId ? { relationId } : {}),
      ...(categoryIds?.length ? { categoryId: In(categoryIds) } : {}),
      ...(type !== undefined ? { type } : {}),
    })
  }
}
