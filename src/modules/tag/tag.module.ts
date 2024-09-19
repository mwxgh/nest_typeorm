import { Module } from '@nestjs/common'
import { TagService } from './tag.service'
import { TagController } from './tag.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tag } from './entities/tag.entity'
import { TagRelation } from './entities/tag-relation.entity'
import { TagRelationService } from './tag-relation.service'

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagRelation])],
  controllers: [TagController],
  providers: [TagService, TagRelationService],
  exports: [TagRelationService],
})
export class TagModule {}
