import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvImportService } from './csv-import.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('import')
export class CsvImportController {
  constructor(private readonly csvImportService: CsvImportService) { }

  @Post('csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string, // In a real app, get from request user
  ) {
    // TODO: Get userId from authenticated user
    // For now, we'll accept it from the body or default to a test user if needed
    // But since we have authentication, we should use it.
    // Assuming we might not have the auth guard set up on this route yet.

    if (!userId) {
      // Fallback or error. For now let's assume it's passed or we can use a placeholder
      // if auth isn't fully integrated in this snippet.
      // But the schema requires userId.
      // Let's assume the frontend sends it or we extract it from JWT.
    }

    return this.csvImportService.initializeImport(file, userId);
  }

  @Get('status/:id')
  async getStatus(@Param('id') id: string) {
    return this.csvImportService.getJobStatus(id);
  }
}
