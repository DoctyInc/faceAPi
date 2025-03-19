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
    ConfigModule.forRoot({
      isGlobal: true, // Ensures .env variables are accessible globally
    }),
    MongooseModule.forFeature([{ name: Emotion.name, schema: EmotionSchema }]),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/test'),
  ],
  controllers: [AppController, EmotionController], // ✅ Add EmotionController here
  providers: [AppService, EmotionService],
})
export class AppModule {}
