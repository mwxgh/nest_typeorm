import config from '@/config/config'
import { Injectable } from '@nestjs/common'
import { randomBytes } from 'crypto'
import * as Minio from 'minio'

const minioConfig = config().minio

@Injectable()
export class MinioService {
  private minioClient: Minio.Client
  private bucketName: string

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: minioConfig.endpoint,
      port: minioConfig.apiPort,
      useSSL: minioConfig.ssl,
      accessKey: minioConfig.access,
      secretKey: minioConfig.secret,
    })
    this.bucketName = minioConfig.bucket
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName)
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName, 'eu-west-1')
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = `${Date.now()}-${randomBytes(8).toString('hex')}.${file.originalname.split('.').pop()}`

    await this.minioClient.putObject(
      this.bucketName,
      fileName,
      file.buffer,
      file.size,
    )
    return {
      fileName,
      url: `${minioConfig.endpoint}:${minioConfig.consolePort}/browser/${this.bucketName}/${fileName}`,
    }
  }

  async getFileUrl(fileName: string) {
    return await this.minioClient.presignedUrl('GET', this.bucketName, fileName)
  }

  async deleteFile(fileName: string) {
    await this.minioClient.removeObject(this.bucketName, fileName)
  }
}
