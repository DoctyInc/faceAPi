import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emotion, EmotionDocument } from '../schemas/emotion.schema';

@Injectable()
export class EmotionService {
  constructor(@InjectModel(Emotion.name) private readonly emotionModel: Model<EmotionDocument>) {}

  // ✅ **Save Emotion Automatically (Detect Emotion)**
  async saveEmotion(data: { referenceId: string; imageUrl: string }): Promise<Emotion> {
    // 👉 **Step 1: Detect Emotion Automatically**
    const detectedEmotion = await this.detectEmotionFromImage(data.imageUrl);

    // 👉 **Step 2: Store in Database**
    const newEmotion = new this.emotionModel({ ...data, detectedEmotion });
    return newEmotion.save();
  }

  // ✅ **Get Emotions by Reference ID + Emotion Ratio**
  async getEmotionsByReferenceId(referenceId: string): Promise<{ images: Emotion[], emotionRatio: Record<string, string> }> {
    const emotions = await this.emotionModel.find({ referenceId }).exec();
    const emotionRatio = this.calculateEmotionRatio(emotions);
    return { images: emotions, emotionRatio };
  }

  // ✅ **AI Model / Google Vision API - Detect Emotion**
  private async detectEmotionFromImage(imageUrl: string): Promise<string> {
    // 👉 **TODO: Replace this with actual AI model**
    const mockEmotions = ['Happy', 'Sad', 'Angry', 'Surprised', 'Confused', 'Tired'];
    return mockEmotions[Math.floor(Math.random() * mockEmotions.length)]; // Mock random emotion
  }

  // ✅ **Calculate Emotion Ratio**
  private calculateEmotionRatio(emotions: Emotion[]): Record<string, string> {
    const total = emotions.length;
    if (total === 0) return {}; // Return empty if no emotions found

    const emotionCounts = emotions.reduce((acc, curr) => {
      const emotion = curr.detectedEmotion ?? 'Unknown'; // Default if undefined
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert counts to percentages
    return Object.fromEntries(
      Object.entries(emotionCounts).map(([emotion, count]) => [
        emotion,
        `${((count / total) * 100).toFixed(2)}%`,
      ])
    );
  }
}
