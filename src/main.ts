import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  process.stdout.write('Starting Nest application...\n');
  const app = await NestFactory.create(AppModule);
  process.stdout.write('Nest application created\n');
  await app.listen(process.env.PORT ?? 3000);
  process.stdout.write(`Application is running on: ${await app.getUrl()}\n`);

  // Keep alive
  setInterval(() => { }, 1000);
}
bootstrap().catch(err => {
  process.stderr.write(`Bootstrap error: ${err}\n`);
  process.exit(1);
});
