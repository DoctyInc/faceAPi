import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EmotionService } from '../services/emotion.service';
import { Emotion } from '../schemas/emotion.schema';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Post()
  async createEmotion(@Body() emotionData: Partial<Emotion>) {
    return this.emotionService.saveEmotion(emotionData);
  }

  @Get(':referenceId')
  async getEmotions(@Param('referenceId') referenceId: string) {
    return this.emotionService.getEmotionsByReferenceId(referenceId);
  }
}
