import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emotion, EmotionDocument } from '../schemas/emotion.schema';

@Injectable()
export class EmotionService {
  constructor(@InjectModel(Emotion.name) private emotionModel: Model<EmotionDocument>) {}

  async createEmotion(referenceId: string, imageUrl: string, detectedEmotion: string): Promise<Emotion> {
    const emotion = new this.emotionModel({ referenceId, imageUrl, detectedEmotion });
    return emotion.save();
  }

  async getEmotionsByReferenceId(referenceId: string): Promise<Emotion[]> {
    return this.emotionModel.find({ referenceId }).exec();
  }
}
