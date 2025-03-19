import { Controller, Get, Param } from '@nestjs/common';
import { EmotionService } from '../services/emotion.service';

@Controller('emotions')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @Get(':referenceId/expression')
  async getExpression(@Param('referenceId') referenceId: string) {
    return this.emotionService.getEmotionsByReferenceId(referenceId);
  }
}
