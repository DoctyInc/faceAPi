import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emotion, EmotionDocument } from '../schemas/emotion.schema';

@Injectable()
export class EmotionService {
  constructor(@InjectModel(Emotion.name) private readonly emotionModel: Model<EmotionDocument>) {}

  // Method to determine the dominant emotion
  private detectExpression(emotion: any): string {
    const emotions = {
      Joy: emotion.joyLikelihood,
      Anger: emotion.angerLikelihood,
      Sorrow: emotion.sorrowLikelihood,
    };

    // Sorting by likelihood priority
    const sortedEmotions = Object.entries(emotions).sort((a, b) => {
      const order = {
        VERY_LIKELY: 5,
        LIKELY: 4,
        POSSIBLE: 3,
        UNLIKELY: 2,
        VERY_UNLIKELY: 1,
      };
      return order[b[1]] - order[a[1]];
    });

    return sortedEmotions[0][1] === 'VERY_UNLIKELY' ? 'Neutral' : sortedEmotions[0][0];
  }

  // Method to fetch emotions by referenceId
  async getEmotionsByReferenceId(referenceId: string): Promise<{ expression: string }> {
    const emotion = await this.emotionModel.findOne({ referenceId }).exec();
    if (!emotion) {
      return { expression: 'Unknown' };
    }
    return { expression: this.detectExpression(emotion) };
  }
}
