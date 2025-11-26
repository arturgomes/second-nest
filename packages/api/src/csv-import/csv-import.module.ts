import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CsvImportService } from './csv-import.service';
import { CsvImportController } from './csv-import.controller';
import { CsvImportProcessor } from './csv-import.processor';
import { CsvImportGateway } from './csv-import.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'csv-import',
    }),
  ],
  controllers: [CsvImportController],
  providers: [
    CsvImportService,
    CsvImportProcessor,
    CsvImportGateway,
    PrismaService,
  ],
})
export class CsvImportModule { }
