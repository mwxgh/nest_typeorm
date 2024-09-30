import { forwardRef, Module } from '@nestjs/common'
import { ReactionService } from './reaction.service'
import { ReactionController } from './reaction.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reaction } from './entities/reaction.entity'
import { ContentModule } from '../content/content.module'
import { CommentModule } from '../comment/comment.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Reaction]),
    forwardRef(() => CommentModule),
    forwardRef(() => ContentModule),
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
  exports: [ReactionService],
})
export class ReactionModule {}
