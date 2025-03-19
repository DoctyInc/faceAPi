import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmotionService } from './services/emotion.service';
import { EmotionController } from './controllers/emotion.controller';
import { Emotion, EmotionSchema } from './schemas/emotion.schema';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect to MongoDB (Ensure .env has MONGO_URI)
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/test'),

    // Register Emotion Schema
    MongooseModule.forFeature([{ name: Emotion.name, schema: EmotionSchema }]),
  ],
  controllers: [AppController, EmotionController],
  providers: [AppService, EmotionService],
})
export class AppModule {}
