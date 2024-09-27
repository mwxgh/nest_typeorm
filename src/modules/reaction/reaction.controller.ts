import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ReactionService } from './reaction.service'
import { CreateReactionDto, UpdateReactionDto } from './dto'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles } from '@/constants'
import { ApiAuth, CurrentUserId } from '@/shared/decorators'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'

@ApiTags('Reactions')
@Controller('reactions')
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post()
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Create reaction' })
  async create(
    @CurrentUserId() userId: number,
    @Body() body: CreateReactionDto,
  ): Promise<void> {
    return this.reactionService.customCreate({ userId, body })
  }

  @Patch(':id')
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Update reaction' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateReactionDto,
  ): Promise<void> {
    return this.reactionService.customUpdate({ id, userId, body })
  }

  @Delete(':id')
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Delete reaction' })
  remove(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
  ): Promise<void> {
    return this.reactionService.deleteBy({ id, userId })
  }
}
