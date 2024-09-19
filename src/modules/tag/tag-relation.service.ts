import AbstractService from '@/shared/services/abstract.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, In, Repository } from 'typeorm'
import { BaseStatusEnum, RelationTypeEnum } from '@/constants'
import { TagRelation } from './entities/tag-relation.entity'
import { Tag } from './entities/tag.entity'

@Injectable()
export class TagRelationService extends AbstractService<TagRelation> {
  constructor(
    @InjectRepository(TagRelation)
    private readonly tagRelationRepository: Repository<TagRelation>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {
    super(tagRelationRepository)
  }

  async assignTagRelations({
    relationId,
    tagIds,
    type,
    entityManager,
  }: {
    relationId: number
    tagIds: number[]
    type: RelationTypeEnum
    entityManager?: EntityManager
  }): Promise<void> {
    const repository = entityManager
      ? entityManager.getRepository(TagRelation)
      : this.tagRelationRepository

    const [tags, count] = await this.tagRepository.findAndCountBy({
      id: In(tagIds),
      status: BaseStatusEnum.Active,
    })

    if (count !== tagIds.length) {
      throw new NotFoundException(`Tag with any IDs was not found !`)
    }

    const contentTags = []
    for (const tag of tags) {
      const contentTag = repository.create({
        relationId,
        tagId: tag.id,
        type,
      })
      contentTags.push(contentTag)
    }

    await repository.save(contentTags)
  }

  async unassignTagRelations({
    relationId,
    tagIds,
    type,
    entityManager,
  }: {
    relationId?: number
    tagIds?: number[]
    type?: RelationTypeEnum
    entityManager?: EntityManager
  }): Promise<void> {
    const repository = entityManager
      ? entityManager.getRepository(TagRelation)
      : this.tagRelationRepository

    await repository.delete({
      ...(relationId ? { relationId } : {}),
      ...(tagIds?.length ? { tagId: In(tagIds) } : {}),
      ...(type !== undefined ? { type } : {}),
    })
  }
}
