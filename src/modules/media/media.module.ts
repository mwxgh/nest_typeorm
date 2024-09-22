import { Module } from '@nestjs/common'
import { MediaService } from './media.service'
import { MediaController } from './media.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Media } from './entities/media.entity'
import { MediaRelation } from './entities/media-relation.entity'
import { MediaRelationService } from './media-relation.service'
import { MinioModule } from '../minio/minio.module'

@Module({
  imports: [TypeOrmModule.forFeature([Media, MediaRelation]), MinioModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRelationService],
  exports: [MediaRelationService],
})
export class MediaModule {}
