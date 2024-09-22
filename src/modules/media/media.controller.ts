import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  UploadedFiles,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common'
import { MediaService } from './media.service'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor, FilesInterceptor } from '@nest-lab/fastify-multer'
import { Auth } from '../auth/decorators/auth.decorator'
import { AllRoles, RoleEnum } from '@/constants'
import { ApiAuth, ApiPageOkResponse, CurrentUserId } from '@/shared/decorators'
import { PageDto } from '@/shared/common/dto'
import { PositiveNumberPipe } from '@/shared/pipes/positive-number.pipe'
import {
  CreateMediaDto,
  MediaDto,
  MediaPageOptionsDto,
  UpdateMediaDto,
} from './dto'

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUserId() userId: number,
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.mediaService.uploadToMinIO([file], createMediaDto, userId)
  }

  @Post('multiple')
  @Auth(...AllRoles)
  @ApiAuth(undefined, { summary: 'Uploads multiple files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 4))
  async uploadMultiple(
    @CurrentUserId() userId: number,
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<void> {
    return this.mediaService.uploadToMinIO(files, createMediaDto, userId)
  }

  @Get()
  @Auth(...AllRoles)
  @ApiAuth(PageDto<MediaDto>, { summary: 'Get media with pagination' })
  @ApiPageOkResponse({
    description: 'Get media list',
    summary: 'Get media list',
    type: PageDto<MediaDto>,
  })
  getAll(@Query() query: MediaPageOptionsDto): Promise<PageDto<MediaDto>> {
    return this.mediaService.getWithPaginate(query)
  }

  @Get(':id')
  @Auth(...AllRoles)
  @ApiAuth(MediaDto, { summary: 'Get media detail by id' })
  get(@Param('id', PositiveNumberPipe) id: number): Promise<MediaDto> {
    return this.mediaService.getById(id)
  }

  @Put(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Update media by id' })
  update(
    @Param('id', PositiveNumberPipe) id: number,
    @CurrentUserId() userId: number,
    @Body() body: UpdateMediaDto,
  ): Promise<void> {
    return this.mediaService.customUpdate({ id, userId, body })
  }

  @Delete(':id')
  @Auth(RoleEnum.BaseAdmin)
  @ApiAuth(undefined, { summary: 'Delete media by id' })
  delete(@Param('id', PositiveNumberPipe) id: number): Promise<void> {
    return this.mediaService.deleteBy({ id })
  }
}
