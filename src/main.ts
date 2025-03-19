import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000; // Use Render's port or fallback to 3000
  await app.listen(port);
  console.log(`✅ Server is running on port ${port}`);
}
bootstrap();

 