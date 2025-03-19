import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type EmotionDocument = Emotion & Document; // ✅ Define EmotionDocument properly


@Schema({ timestamps: true })
export class Emotion extends Document {
  @Prop({ required: true })
  referenceId: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ required: false  })
  joyLikelihood: string;

  @Prop({ required: false  })
  angerLikelihood: string;

  @Prop({ required: false  })
  sorrowLikelihood: string;

  @Prop({ required: false }) // Make it optional
  detectedEmotion?: string;
}

export const EmotionSchema = SchemaFactory.createForClass(Emotion);
