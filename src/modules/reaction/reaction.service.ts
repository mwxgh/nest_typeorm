import { Injectable } from '@nestjs/common'
import { CreateReactionDto } from './dto/create-reaction.dto'
import { UpdateReactionDto } from './dto/update-reaction.dto'
import AbstractService from '@/shared/services/abstract.service'
import { Reaction } from './entities/reaction.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ContentService } from '../content/content.service'
import { CommentService } from '../comment/comment.service'

@Injectable()
export class ReactionService extends AbstractService<Reaction> {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
    private readonly contentService: ContentService,
    private readonly commentService: CommentService,
  ) {
    super(reactionRepository)
  }
  async customCreate({
    userId,
    body,
  }: {
    userId: number
    body: CreateReactionDto
  }) {
    const { contentId, commentId } = body

    await this.contentService.validateExist({ id: contentId })
    await this.commentService.validateExist({ id: commentId })

    await this.validateDuplicate({ createdBy: userId, commentId, contentId })

    await this.save({
      ...body,
      createdBy: userId,
    })
  }

  async customUpdate({
    id,
    userId,
    body,
  }: {
    id: number
    userId: number
    body: UpdateReactionDto
  }) {
    await this.validateExist({ id, createdBy: userId })

    await this.updateBy({ id }, { ...body })
  }

  async deleteBy({
    id,
    userId,
  }: {
    id: number
    userId: number
  }): Promise<void> {
    await this.validateExist({ id, createdBy: userId })

    await this.reactionRepository.delete({ id })
  }
}
