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
import { TagService } from './tag.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles, RoleEnum } from '@/constants'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import { ApiTags } from '@nestjs/swagger'
import { CreateTagDto, TagDto, TagsPageOptionsDto, UpdateTagDto } from './dto'

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Create new tag' })
  create(
    @CurrentUserId() userId: number,
    @Body() body: CreateTagDto,
  ): Promise<void> {
    return this.tagService.createTag({ userId, body })
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<TagDto>, { summary: 'Find tag with pagination' })
  @ApiPageOkResponse({
    description: 'Get tag list',
    summary: 'Get tag list',
    type: PageDto<TagDto>,
  })
  getAll(@Query() query: TagsPageOptionsDto): Promise<PageDto<TagDto>> {
    return this.tagService.getTagsPaginate(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(TagDto, { summary: 'Find tag by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<TagDto> {
    return this.tagService.getTagById(id)
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update tag by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateTagDto,
  ): Promise<void> {
    return this.tagService.updateTagById({ id, userId, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Delete tag by id' })
  delete(@Param('id', PositiveNumberPipe) id: number): Promise<void> {
    return this.tagService.deleteTagById({ id })
  }
}
