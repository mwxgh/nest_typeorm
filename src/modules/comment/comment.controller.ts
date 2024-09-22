import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common'
import { CommentService } from './comment.service'
import {
  CommentDto,
  CommentsPageOptionsDto,
  CreateCommentDto,
  UpdateCommentDto,
} from './dto'
import { ApiTags } from '@nestjs/swagger'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles, RoleEnum } from '@/constants'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Create new comment' })
  create(
    @CurrentUserId() userId: number,
    @Body() body: CreateCommentDto,
  ): Promise<void> {
    return this.commentService.customCreate({ userId, body })
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<CommentDto>, { summary: 'Get comment with pagination' })
  @ApiPageOkResponse({
    description: 'Get comment list',
    summary: 'Get comment list',
    type: PageDto<CommentDto>,
  })
  getAll(@Query() query: CommentsPageOptionsDto): Promise<PageDto<CommentDto>> {
    return this.commentService.getWithPaginate(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(CommentDto, { summary: 'Get comment detail by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<CommentDto> {
    return this.commentService.getById(id)
  }

  @Get(':id/descendants')
  @Auth(...AllRoles)
  @ApiAuth(CommentDto, { summary: 'Get comment with descendants by id' })
  getDescendants(
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<CommentDto[]> {
    return this.commentService.getDescendants(id)
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update comment by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateCommentDto,
  ): Promise<void> {
    return this.commentService.customUpdate({ id, userId, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Delete comment by id' })
  delete(@Param('id', PositiveNumberPipe) id: number): Promise<void> {
    return this.commentService.deleteBy({ id })
  }
}
