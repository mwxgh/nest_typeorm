import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import AbstractService from '@/shared/services/abstract.service'
import { Tag } from './entities/tag.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { TagsPageOptionsDto } from './dto/tags-page-options.dto'
import { trim } from 'lodash'
import { Direction } from '@/constants'
import { PageDto } from '@/shared/common/dto'
import { TagDto } from './dto/tag.dto'

@Injectable()
export class TagService extends AbstractService<Tag> {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {
    super(tagRepository)
  }
  async createTag({ userId, body }: { userId: number; body: CreateTagDto }) {
    const data = Object.assign(body, {
      slug: await this.generateSlug(body.name),
    })

    await this.save({
      ...data,
      createdBy: userId,
      updatedBy: userId,
    })
  }

  private buildQueryList(
    pageOptionsDto: TagsPageOptionsDto,
  ): SelectQueryBuilder<Tag> {
    const { order, orderBy, q } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<Tag> =
      this.tagRepository.createQueryBuilder('tag')

    if (q) {
      queryBuilder.searchByString(trim(q), ['tag.name'])
    }

    return queryBuilder.orderBy(
      `tag.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getTagsPaginate(
    pageOptionsDto: TagsPageOptionsDto,
  ): Promise<PageDto<TagDto>> {
    const queryBuilder: SelectQueryBuilder<Tag> =
      this.buildQueryList(pageOptionsDto)

    const [tags, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return tags.toPageDto(pageMeta)
  }

  async findTagById(id: number): Promise<Tag> {
    const tag = await this.findOneBy({ id })

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} was not found.`)
    }

    return tag
  }

  async getTagById(id: number): Promise<TagDto> {
    return (await this.findTagById(id)).toDto()
  }

  async updateTagById({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateTagDto
  }): Promise<void> {
    const tag = await this.findTagById(id)

    if (body.name)
      Object.assign(body, {
        slug: await this.generateSlug(body.name),
      })

    await this.updateBy(tag.id, { ...body, updatedBy: userId })
  }

  async deleteTagById({ id }: { id: number }): Promise<void> {
    const tag = await this.findTagById(id)

    await this.softDelete(tag.id)
  }
}
