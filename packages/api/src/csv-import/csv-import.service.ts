import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CsvImportService {
  constructor(
    @InjectQueue('csv-import') private importQueue: Queue,
    private prisma: PrismaService,
  ) { }

  async initializeImport(file: Express.Multer.File, userId: string) {
    // Create import job record
    const importJob = await this.prisma.importJob.create({
      data: {
        filename: file.originalname,
        userId: userId,
        status: 'PENDING',
      },
    });

    // Queue the processing
    await this.importQueue.add(
      'process-csv',
      {
        importJobId: importJob.id,
        filePath: file.path,
      },
      {
        removeOnComplete: true, // Optional: keep jobs for debugging?
      },
    );

    return importJob;
  }

  async getJobStatus(jobId: string) {
    return this.prisma.importJob.findUnique({
      where: { id: jobId },
    });
  }
}
