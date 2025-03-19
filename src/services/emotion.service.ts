import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emotion, EmotionDocument } from '../schemas/emotion.schema';

@Injectable()
export class EmotionService {
  constructor(
    @InjectModel(Emotion.name) private readonly emotionModel: Model<EmotionDocument>,
  ) {}

  // ✅ Fetch emotions by referenceId
  async getEmotionsByReferenceId(referenceId: string): Promise<Emotion[]> {
    return this.emotionModel.find({ referenceId }).exec();
  }

  // ✅ Save an emotion entry
  async saveEmotion(emotionData: Partial<Emotion>): Promise<Emotion> {
    const newEmotion = new this.emotionModel(emotionData);
    return newEmotion.save();
  }
}
