import { Module } from '@nestjs/common'
import { ReactionService } from './reaction.service'
import { ReactionController } from './reaction.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Reaction } from './entities/reaction.entity'
import { ContentModule } from '../content/content.module'
import { CommentModule } from '../comment/comment.module'

@Module({
  imports: [TypeOrmModule.forFeature([Reaction]), ContentModule, CommentModule],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}
