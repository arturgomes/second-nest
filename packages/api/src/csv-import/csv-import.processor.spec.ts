import { Test, TestingModule } from '@nestjs/testing';
import { CsvImportProcessor } from './csv-import.processor';
import { PrismaService } from '../prisma.service';
import { CsvImportGateway } from './csv-import.gateway';
import { Job } from 'bull';
import { createReadStream, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('CsvImportProcessor', () => {
  let processor: CsvImportProcessor;
  let prismaService: PrismaService;
  let gateway: CsvImportGateway;

  const mockPrismaService = {
    importJob: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    post: {
      createMany: jest.fn(),
    },
  };

  const mockGateway = {
    notifyProgress: jest.fn(),
  };

  const testCsvPath = join(__dirname, 'test.csv');

  beforeAll(() => {
    writeFileSync(testCsvPath, 'title,content,type,published\nTest Post,Content,POST,true\n');
  });

  afterAll(() => {
    try {
      unlinkSync(testCsvPath);
    } catch (e) { }
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsvImportProcessor,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CsvImportGateway, useValue: mockGateway },
      ],
    }).compile();

    processor = module.get<CsvImportProcessor>(CsvImportProcessor);
    prismaService = module.get<PrismaService>(PrismaService);
    gateway = module.get<CsvImportGateway>(CsvImportGateway);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should process csv file', async () => {
    const job = {
      data: {
        importJobId: 'job-id',
        filePath: testCsvPath,
      },
      progress: jest.fn(),
    } as unknown as Job;

    mockPrismaService.importJob.findUnique.mockResolvedValue({ userId: 'user-id' });

    await processor.processImport(job);

    expect(mockPrismaService.importJob.update).toHaveBeenCalledWith({
      where: { id: 'job-id' },
      data: { status: 'PROCESSING' },
    });

    expect(mockPrismaService.post.createMany).toHaveBeenCalled();
    expect(mockGateway.notifyProgress).toHaveBeenCalled();

    expect(mockPrismaService.importJob.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'job-id' },
        data: expect.objectContaining({ status: 'COMPLETED' })
      })
    );
  });
});
