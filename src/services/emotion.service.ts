import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emotion, EmotionDocument } from '../schemas/emotion.schema';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as path from 'path';

@Injectable()
export class EmotionService {
  private visionClient: ImageAnnotatorClient;

  constructor(@InjectModel(Emotion.name) private readonly emotionModel: Model<EmotionDocument>) {
    // ✅ Load Google Vision API credentials
    this.visionClient = new ImageAnnotatorClient({
      keyFilename: path.join(__dirname, '../../docty-vision-api-key-json.json'),
    });
  }

  // ✅ **Save Emotion Automatically**
  async saveEmotion(data: { referenceId: string; imageUrl: string }): Promise<Emotion> {
    const detectedEmotion = await this.detectEmotionFromImage(data.imageUrl);
    const newEmotion = new this.emotionModel({ ...data, detectedEmotion });
    return newEmotion.save();
  }

  // ✅ **Get Emotions by Reference ID + Emotion Ratio**
  async getEmotionsByReferenceId(referenceId: string): Promise<{ images: Emotion[], emotionRatio: Record<string, string> }> {
    const emotions = await this.emotionModel.find({ referenceId }).exec();
    const emotionRatio = this.calculateEmotionRatio(emotions);
    return { images: emotions, emotionRatio };
  }

  // ✅ **Detect Emotion using Google Vision API**
private async detectEmotionFromImage(imageUrl: string): Promise<string> {
  try {
    const [result] = await this.visionClient.faceDetection(imageUrl);
    const faces = result.faceAnnotations;

    if (!faces || faces.length === 0) {
      return 'Unknown'; // No face detected
    }

    // ✅ Ensure the values are numbers before processing them
    const emotions = {
      joyLikelihood: this.convertLikelihoodToNumber(faces[0].joyLikelihood),
      sorrowLikelihood: this.convertLikelihoodToNumber(faces[0].sorrowLikelihood),
      angerLikelihood: this.convertLikelihoodToNumber(faces[0].angerLikelihood),
      surpriseLikelihood: this.convertLikelihoodToNumber(faces[0].surpriseLikelihood),
    };

    return this.getHighestEmotion(emotions);
  } catch (error) {
    console.error('❌ Error detecting emotion:', error);
    return 'Unknown';
  }
}
// ✅ Convert Likelihood Enum to a Number
private convertLikelihoodToNumber(likelihood: any): number {
  const likelihoodMap = {
    UNKNOWN: 0,
    VERY_UNLIKELY: 1,
    UNLIKELY: 2,
    POSSIBLE: 3,
    LIKELY: 4,
    VERY_LIKELY: 5,
  };

  if (typeof likelihood === 'number') {
    return likelihood; // It's already a number
  }

  return likelihoodMap[likelihood as keyof typeof likelihoodMap] || 0;
}


  // ✅ **Helper: Convert Google Vision Likelihood Enum to String**
  private convertLikelihoodToString(likelihood: number | null | undefined): string {
    const likelihoodMap = {
      0: 'UNKNOWN',
      1: 'VERY_UNLIKELY',
      2: 'UNLIKELY',
      3: 'POSSIBLE',
      4: 'LIKELY',
      5: 'VERY_LIKELY',
    };

    return likelihood !== null && likelihood !== undefined ? likelihoodMap[likelihood] : 'UNKNOWN';
  }
  

  // ✅ **Helper: Determine Highest Emotion**
  private getHighestEmotion(emotions: Record<string, number>): string {
    const sortedEmotions = Object.entries(emotions).sort((a, b) => b[1] - a[1]);
    return sortedEmotions.length > 0 ? sortedEmotions[0][0] : 'Unknown';
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

    return Object.fromEntries(
      Object.entries(emotionCounts).map(([emotion, count]) => [
        emotion,
        `${((count / total) * 100).toFixed(2)}%`,
      ])
    );
  }
}
