import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { Content } from './entities/content.entity'
import AbstractService from '@/shared/services/abstract.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import { ContentsPageOptionsDto } from './dto/contents-page-options.dto'
import { trim } from 'lodash'
import { Direction } from '@/constants'
import { PageDto } from '@/shared/common/dto'
import { ContentDto } from './dto/content.dto'

@Injectable()
export class ContentService extends AbstractService<Content> {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>,
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
    const data = Object.assign(body, {
      slug: await this.generateSlug(body.title),
    })

    await this.save({
      ...data,
      createdBy: userId,
    })
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

  async findById(id: number): Promise<Content> {
    const content = await this.findOneBy({ id })

    if (!content) {
      throw new NotFoundException(`Content with ID ${id} was not found.`)
    }

    return content
  }

  async getContentById(id: number): Promise<ContentDto> {
    return (await this.findById(id)).toDto()
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    console.log(updateContentDto)
    return `This action updates a #${id} content`
  }

  remove(id: number) {
    return `This action removes a #${id} content`
  }
}
