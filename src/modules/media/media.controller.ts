import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common'
import { MediaService } from './media.service'
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateMediaDto } from './dto/create-media.dto'
import { FileInterceptor, FilesInterceptor } from '@nest-lab/fastify-multer'

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    return this.mediaService.uploadMediaToSystem(file, createMediaDto)
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Uploads multiple files' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 4))
  async uploadMultiple(
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFiles() files: Array<File>,
  ): Promise<void> {
    console.log(files)
  }
}
