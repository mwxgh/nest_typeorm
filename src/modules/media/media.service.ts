import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import AbstractService from '@/shared/services/abstract.service'
import { Media } from './entities/media.entity'
import { CreateMediaDto } from './dto/create-media.dto'
import * as path from 'path'
import { writeFile } from 'fs/promises'
import config from '@/config/config'
import { BaseStatusEnum } from '@/constants'
import { randomBytes } from 'crypto'

@Injectable()
export class MediaService extends AbstractService<Media> {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
    super(mediaRepository)
  }

  async uploadMediaToSystem(
    file: Express.Multer.File,
    createMediaDto: CreateMediaDto,
  ): Promise<void> {
    const filesDestination = config().fileUpload.destination

    const timestampPrefix = Date.now()
    const randomSuffix = randomBytes(8).toString('hex') // 16 hex characters
    const filename = `${timestampPrefix}-${randomSuffix}${path.extname(file.originalname)}`

    const absoluteFileDestination = path.resolve(
      process.cwd(),
      filesDestination,
      filename,
    )

    await writeFile(absoluteFileDestination, file.buffer)

    const media = {
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
    }

    await this.save(media)
  }
}
