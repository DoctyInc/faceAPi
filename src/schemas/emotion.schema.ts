import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type EmotionDocument = Emotion & Document; // ✅ Define EmotionDocument properly


@Schema({ timestamps: true })
export class Emotion extends Document {
  @Prop({ required: true })
  referenceId: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: true })
  joyLikelihood: string;

  @Prop({ required: true })
  angerLikelihood: string;

  @Prop({ required: true })
  sorrowLikelihood: string;

  @Prop({ required: false }) // Make it optional
  detectedEmotion?: string;
}

export const EmotionSchema = SchemaFactory.createForClass(Emotion);
