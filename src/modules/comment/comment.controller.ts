import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
  @ApiAuth(PageDto<CommentDto>, { summary: 'Find comment with pagination' })
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
  @ApiAuth(CommentDto, { summary: 'Find comment by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<CommentDto> {
    return this.commentService.getById(id)
  }

  @Get(':id/descendants')
  @Auth(...AllRoles)
  @ApiAuth(CommentDto, { summary: 'Find comment by id' })
  getDescendants(
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<CommentDto[]> {
    return this.commentService.getDescendants(id)
  }

  @Get(':id/family-tree')
  @Auth(...AllRoles)
  @ApiAuth(CommentDto, { summary: 'Find comment by id' })
  getFamilyTree(
    @Param('id', PositiveNumberPipe) id: number,
  ): Promise<CommentDto[]> {
    return this.commentService.getFamilyTree(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id)
  }
}
