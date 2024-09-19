import AbstractService from '@/shared/services/abstract.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, In, Repository } from 'typeorm'
import { BaseStatusEnum, RelationTypeEnum } from '@/constants'
import { MediaRelation } from './entities/media-relation.entity'
import { Media } from './entities/media.entity'

@Injectable()
export class MediaRelationService extends AbstractService<MediaRelation> {
  constructor(
    @InjectRepository(MediaRelation)
    private readonly mediaRelationRepository: Repository<MediaRelation>,
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {
    super(mediaRelationRepository)
  }

  async assignRelations({
    relationId,
    mediaIds,
    type,
    entityManager,
  }: {
    relationId: number
    mediaIds: number[]
    type: RelationTypeEnum
    entityManager?: EntityManager
  }): Promise<void> {
    const repository = entityManager
      ? entityManager.getRepository(MediaRelation)
      : this.mediaRelationRepository

    const [medias, count] = await this.mediaRepository.findAndCountBy({
      id: In(mediaIds),
      status: BaseStatusEnum.Active,
    })

    if (count !== mediaIds.length) {
      throw new NotFoundException(`Media with any IDs was not found !`)
    }

    const contentMedias = []
    for (const media of medias) {
      const contentMedia = repository.create({
        relationId,
        mediaId: media.id,
        type,
      })
      contentMedias.push(contentMedia)
    }

    await repository.save(contentMedias)
  }

  async unassignRelations({
    relationId,
    mediaIds,
    type,
    entityManager,
  }: {
    relationId?: number
    mediaIds?: number[]
    type?: RelationTypeEnum
    entityManager?: EntityManager
  }): Promise<void> {
    const repository = entityManager
      ? entityManager.getRepository(MediaRelation)
      : this.mediaRelationRepository

    await repository.delete({
      ...(relationId ? { relationId } : {}),
      ...(mediaIds?.length ? { mediaId: In(mediaIds) } : {}),
      ...(type !== undefined ? { type } : {}),
    })
  }
}
