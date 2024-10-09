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
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Create new tag' })
  create(
    @CurrentUserId() userId: number,
    @Body() body: CreateTagDto,
  ): Promise<void> {
    return this.tagService.customCreate({ userId, body })
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<TagDto>, { summary: 'Get tag with pagination' })
  @ApiPageOkResponse({
    description: 'Get tag list',
    summary: 'Get tag list',
    type: PageDto<TagDto>,
  })
  getAll(@Query() query: TagsPageOptionsDto): Promise<PageDto<TagDto>> {
    return this.tagService.getWithPaginate(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(TagDto, { summary: 'Get tag detail by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<TagDto> {
    return this.tagService.getById(id)
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update tag by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateTagDto,
  ): Promise<void> {
    return this.tagService.customUpdate({ id, userId, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Delete tag by id' })
  delete(@Param('id', PositiveNumberPipe) id: number): Promise<void> {
    return this.tagService.deleteBy({ id })
  }
}
