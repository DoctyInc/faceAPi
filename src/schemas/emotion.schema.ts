import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmotionDocument = Emotion & Document;

@Schema({ timestamps: true })
export class Emotion {
  @Prop({ required: true })
  referenceId: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  detectedEmotion: string;
}

export const EmotionSchema = SchemaFactory.createForClass(Emotion);
