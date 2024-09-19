import { Module } from '@nestjs/common'
import { ContentService } from './content.service'
import { ContentController } from './content.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Content } from './entities/content.entity'
import { CategoryModule } from '../category/category.module'
import { TagModule } from '../tag/tag.module'

@Module({
  imports: [TypeOrmModule.forFeature([Content]), CategoryModule, TagModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
