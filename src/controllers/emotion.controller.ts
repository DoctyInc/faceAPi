import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { EmotionService } from '../services/emotion.service';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Post()
  async createEmotion(@Body() body: { referenceId: string; imageUrl: string; detectedEmotion: string }) {
    return this.emotionService.createEmotion(body.referenceId, body.imageUrl, body.detectedEmotion);
  }

  @Get(':referenceId')
  async getEmotions(@Param('referenceId') referenceId: string) {
    return this.emotionService.getEmotionsByReferenceId(referenceId);
  }
}
