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
import { ContentService } from './content.service'
import { CreateContentDto } from './dto/create-content.dto'
import { UpdateContentDto } from './dto/update-content.dto'
import { ApiTags } from '@nestjs/swagger'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles, RoleEnum } from '@/constants'
import { PageDto } from '@/shared/common/dto'
import { ContentDto } from './dto/content.dto'
import { ContentsPageOptionsDto } from './dto/contents-page-options.dto'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(+id, updateContentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contentService.remove(+id)
  }
}
