import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import AbstractService from '@/shared/services/abstract.service'
import { Media } from './entities/media.entity'
import { CreateMediaDto } from './dto/create-media.dto'
import * as path from 'path'
import { writeFile, unlink } from 'fs/promises'
import config from '@/config/config'
import { BaseStatusEnum, Direction } from '@/constants'
import { randomBytes } from 'crypto'
import { MediaPageOptionsDto } from './dto/media-page-options.dto'
import { MediaDto } from './dto/media.dto'
import { PageDto } from '@/shared/common/dto'
import { trim } from 'lodash'
import { UpdateMediaDto } from './dto/update-media.dto'
import { Logger } from 'winston'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

@Injectable()
export class MediaService extends AbstractService<Media> {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    super(mediaRepository)
  }

  async uploadMediaToSystem(
    file: Express.Multer.File,
    createMediaDto: CreateMediaDto,
  ): Promise<void> {
    const filesDestination = config().fileUpload.destination
    const fileSizeValid = config().fileUpload.maxSize

    if (file.size > fileSizeValid) {
      throw new BadRequestException(
        `File size exceeds the maximum limit of ${fileSizeValid / (1024 * 1024)} MB`,
      )
    }

    const timestampPrefix = Date.now()
    const randomSuffix = randomBytes(8).toString('hex') // 16 hex characters
    const filename = `${timestampPrefix}-${randomSuffix}${path.extname(file.originalname)}`

    const absoluteFileDestination = path.resolve(
      process.cwd(),
      filesDestination,
      filename,
    )

    await writeFile(absoluteFileDestination, file.buffer)

    await this.save({
      ...createMediaDto,
      originalName: file.originalname,
      filename,
      type: file.mimetype.split('/')[0],
      mimetype: file.mimetype,
      url: absoluteFileDestination,
      status:
        BaseStatusEnum[
          createMediaDto.status as unknown as keyof typeof BaseStatusEnum
        ],
    })
  }

  private buildQueryList(
    pageOptionsDto: MediaPageOptionsDto,
  ): SelectQueryBuilder<Media> {
    const { order, orderBy, q } = pageOptionsDto

    const queryBuilder: SelectQueryBuilder<Media> =
      this.mediaRepository.createQueryBuilder('media')

    if (q) {
      queryBuilder.searchByString(trim(q), ['media.type'])
    }

    return queryBuilder.orderBy(
      `media.${orderBy ?? 'createdAt'}`,
      order ?? Direction.ASC,
    )
  }

  async getMediaPaginate(
    pageOptionsDto: MediaPageOptionsDto,
  ): Promise<PageDto<MediaDto>> {
    const queryBuilder: SelectQueryBuilder<Media> =
      this.buildQueryList(pageOptionsDto)

    const [media, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return media.toPageDto(pageMeta)
  }

  async findMediaById(id: number): Promise<Media> {
    const media = await this.findOneBy({ id })

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} was not found.`)
    }

    return media
  }

  async getMediaById(id: number): Promise<MediaDto> {
    return (await this.findMediaById(id)).toDto()
  }

  async updateMediaById({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateMediaDto
  }): Promise<void> {
    const tag = await this.findMediaById(id)

    await this.updateBy(tag.id, { ...body, updatedBy: userId })
  }

  async deleteMediaById({ id }: { id: number }): Promise<void> {
    const media = await this.findMediaById(id)

    if (media.url) {
      try {
        await unlink(media.url)
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error
        }
        this.logger.warn(
          `File not found at ${media.url}, proceeding with deletion.`,
          {},
        )
      }
    }

    await this.softDelete(media.id)
  }
}
