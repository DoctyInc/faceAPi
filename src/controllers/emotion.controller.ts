import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmotionService } from '../services/emotion.service';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  // ✅ Save Emotion
  @Post()
  async createEmotion(@Body() emotionData: { referenceId: string; imageUrl: string }) {
    return this.emotionService.saveEmotion(emotionData);
  }

  // ✅ Get Emotions and Emotion Ratio
  @Get(':referenceId')
  async getEmotions(@Param('referenceId') referenceId: string) {
    return this.emotionService.getEmotionsByReferenceId(referenceId);
  }
}
