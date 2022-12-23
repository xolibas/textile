import { Controller, HttpCode, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(public fileService: FileService) {}

  @HttpCode(200)
  @Post()
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
    return this.fileService.saveFiles([file], folder);
  }
}
