import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Patch,
} from '@nestjs/common'
import { ContentService } from './content.service'
import { ApiTags } from '@nestjs/swagger'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles, RoleEnum } from '@/constants'
import { PageDto } from '@/shared/common/dto'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import {
  ContentDto,
  ContentsPageOptionsDto,
  CreateContentDto,
  UpdateContentDto,
  UpdateContentPriorityDto,
  UpdateContentStatusDto,
  UpdateContentTypeDto,
} from './dto'

@ApiTags('Contents')
@Controller('contents')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Create new content' })
  create(
    @CurrentUserId() userId: number,
    @Body() body: CreateContentDto,
  ): Promise<void> {
    return this.contentService.createContent({ userId, body })
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<ContentDto>, { summary: 'Find content with pagination' })
  @ApiPageOkResponse({
    description: 'Get content list',
    summary: 'Get content list',
    type: PageDto<ContentDto>,
  })
  getAll(@Query() query: ContentsPageOptionsDto): Promise<PageDto<ContentDto>> {
    return this.contentService.getContentsPaginate(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(ContentDto, { summary: 'Find content by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<ContentDto> {
    return this.contentService.getContentById(id)
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update content by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateContentDto,
  ): Promise<void> {
    return this.contentService.updateContentById({ id, userId, body })
  }

  @Patch(':id/status')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update content status by id' })
  updateStatus(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateContentStatusDto,
  ): Promise<void> {
    return this.contentService.updatePropertyContentById({ id, userId, body })
  }

  @Patch(':id/type')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update content type by id' })
  updateType(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateContentTypeDto,
  ): Promise<void> {
    return this.contentService.updatePropertyContentById({ id, userId, body })
  }

  @Patch(':id/priority')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update content priority by id' })
  updatePriority(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateContentPriorityDto,
  ): Promise<void> {
    return this.contentService.updatePropertyContentById({ id, userId, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Delete content by id' })
  remove(@Param('id', PositiveNumberPipe) id: number) {
    return this.contentService.deleteCategoryById({ id })
  }
}
