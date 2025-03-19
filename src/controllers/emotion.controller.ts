import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmotionService } from '../services/emotion.service';
import { Emotion } from '../schemas/emotion.schema';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  // ✅ **Post Image - Detect & Store Emotion**
  @Post()
  async createEmotion(@Body() emotionData: { referenceId: string; imageUrl: string }) {
    return this.emotionService.saveEmotion(emotionData);
  }

  // ✅ **Get Emotions for a Reference ID**
  @Get(':referenceId')
  async getEmotions(@Param('referenceId') referenceId: string) {
    return this.emotionService.getEmotionsByReferenceId(referenceId);
  }
}
