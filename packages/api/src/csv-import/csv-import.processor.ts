import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { PrismaService } from '../prisma.service';
import { CsvImportGateway } from './csv-import.gateway';
import { Injectable, Logger } from '@nestjs/common';

@Processor('csv-import')
@Injectable()
export class CsvImportProcessor {
  private readonly logger = new Logger(CsvImportProcessor.name);
  private readonly BATCH_SIZE = 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: CsvImportGateway,
  ) { }

  @Process('process-csv')
  async processImport(job: Job<{ importJobId: string; filePath: string }>) {
    const { importJobId, filePath } = job.data;
    this.logger.log(`Processing job ${importJobId} file: ${filePath}`);

    const batch: any[] = [];
    let processedCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    // Update status to PROCESSING
    await this.prisma.importJob.update({
      where: { id: importJobId },
      data: { status: 'PROCESSING' },
    });

    // Count total lines first
    const totalLines = await this.countLines(filePath);
    await this.prisma.importJob.update({
      where: { id: importJobId },
      data: { total: totalLines },
    });

    // Notify initial total
    this.gateway.notifyProgress(importJobId, {
      processed: 0,
      total: totalLines,
      errors: 0,
      status: 'PROCESSING'
    });

    const parser = createReadStream(filePath).pipe(
      parse({ columns: true, skip_empty_lines: true }),
    );

    for await (const record of parser) {
      try {
        // Basic validation
        if (!record.title) {
          throw new Error('Missing title');
        }

        batch.push({
          title: record.title,
          content: record.content,
          type: record.type || 'POST',
          published: record.published === 'true',
          authorId: 'temp-author-id', // We need to handle this. Maybe passed in job data?
          // For now, we might need to fetch the user from the job
        });

        if (batch.length >= this.BATCH_SIZE) {
          await this.insertBatch(batch, importJobId);
          processedCount += batch.length;
          batch.length = 0; // Clear batch

          // Update progress
          await this.updateProgress(importJobId, processedCount, errorCount, totalLines);
        }
      } catch (error: any) {
        errorCount++;
        errors.push({ row: processedCount + errorCount + batch.length, error: error.message, record });
      }
    }

    // Process remaining
    if (batch.length > 0) {
      await this.insertBatch(batch, importJobId);
      processedCount += batch.length;
    }

    // Finalize
    await this.prisma.importJob.update({
      where: { id: importJobId },
      data: {
        status: errorCount > 0 && processedCount === 0 ? 'FAILED' : 'COMPLETED',
        processed: processedCount,
        errors: errorCount,
        errorLog: JSON.stringify(errors),
        progress: 100,
      },
    });

    this.gateway.notifyProgress(importJobId, {
      processed: processedCount,
      total: totalLines,
      errors: errorCount,
      status: 'COMPLETED'
    });
  }

  private async countLines(filePath: string): Promise<number> {
    const { createInterface } = await import('readline');
    let lines = 0;
    const rl = createInterface({
      input: createReadStream(filePath),
      crlfDelay: Infinity,
    });
    for await (const line of rl) {
      lines++;
    }
    return Math.max(0, lines - 1); // Exclude header
  }

  private async insertBatch(batch: any[], importJobId: string) {
    // We need the userId from the job to associate posts
    const job = await this.prisma.importJob.findUnique({ where: { id: importJobId } });
    if (!job) return;

    const postsToInsert = batch.map(p => ({ ...p, authorId: job.userId }));

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.post.createMany({
          data: postsToInsert,
          skipDuplicates: true,
        });
      });
    } catch (error) {
      this.logger.error(`Failed to insert batch for job ${importJobId}:`, error);
      throw error;
    }
  }

  private async updateProgress(importJobId: string, processed: number, errors: number, total: number) {
    await this.prisma.importJob.update({
      where: { id: importJobId },
      data: { processed, errors }
    });

    this.gateway.notifyProgress(importJobId, {
      processed,
      total,
      errors,
      status: 'PROCESSING'
    });
  }
}
