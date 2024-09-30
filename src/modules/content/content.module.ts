import { forwardRef, Module } from '@nestjs/common'
import { ContentService } from './content.service'
import { ContentController } from './content.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Content } from './entities/content.entity'
import { CategoryModule } from '../category/category.module'
import { TagModule } from '../tag/tag.module'
import { MediaModule } from '../media/media.module'
import { CommentModule } from '../comment/comment.module'
import { ReactionModule } from '../reaction/reaction.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    CategoryModule,
    TagModule,
    MediaModule,
    CommentModule,
    forwardRef(() => ReactionModule),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
