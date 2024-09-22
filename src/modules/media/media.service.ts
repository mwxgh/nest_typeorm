import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, SelectQueryBuilder } from 'typeorm'
import AbstractService from '@/shared/services/abstract.service'
import { Media } from './entities/media.entity'
import { BaseStatusEnum, Direction } from '@/constants'
import { PageDto } from '@/shared/common/dto'
import { trim } from 'lodash'
import { Logger } from 'winston'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'
import {
  CreateMediaDto,
  MediaDto,
  MediaPageOptionsDto,
  UpdateMediaDto,
} from './dto'
import { MinioService } from '../minio/minio.service'

@Injectable()
export class MediaService extends AbstractService<Media> {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly minioService: MinioService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {
    super(mediaRepository)
  }

  async uploadToMinIO(
    files: Express.Multer.File[],
    createMediaDto: CreateMediaDto,
    userId: number,
  ): Promise<void> {
    try {
      await this.minioService.createBucketIfNotExists()

      const uploadPromises = files.map(async (file) => {
        const { fileName, url } = await this.minioService.uploadFile(file)

        await this.save({
          ...createMediaDto,
          originalName: file.originalname,
          filename: fileName,
          type: file.mimetype.split('/')[0],
          mimetype: file.mimetype,
          url,
          status:
            BaseStatusEnum[
              createMediaDto.status as unknown as keyof typeof BaseStatusEnum
            ],
          createdBy: userId,
          updatedBy: userId,
        })
      })

      await Promise.all(uploadPromises)
    } catch (error) {
      throw new Error(`Failed to upload files: ${error.message}`)
    }
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

  async getWithPaginate(
    pageOptionsDto: MediaPageOptionsDto,
  ): Promise<PageDto<MediaDto>> {
    const queryBuilder: SelectQueryBuilder<Media> =
      this.buildQueryList(pageOptionsDto)

    const [media, pageMeta] = await queryBuilder.paginate(pageOptionsDto)

    return media.toPageDto(pageMeta)
  }

  async findById(id: number): Promise<Media> {
    const media = await this.findOneBy({ id })

    if (!media) {
      throw new NotFoundException(`Media with ID ${id} was not found.`)
    }

    return media
  }

  async getById(id: number): Promise<MediaDto> {
    return (await this.findById(id)).toDto()
  }

  async customUpdate({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateMediaDto
  }): Promise<void> {
    const tag = await this.findById(id)

    await this.updateBy(tag.id, { ...body, updatedBy: userId })
  }

  async deleteBy({ id }: { id: number }): Promise<void> {
    const media = await this.findById(id)

    await this.minioService.deleteFile(media.filename)

    await this.softDelete(media.id)
  }
}
