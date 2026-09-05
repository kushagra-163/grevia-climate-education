import mongoose, { Schema, Document } from 'mongoose';

export type ClimateTopic =
  | 'climate_science'
  | 'energy'
  | 'renewable_energy'
  | 'waste'
  | 'water'
  | 'biodiversity'
  | 'transportation'
  | 'sustainable_living';

export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ILesson extends Document {
  title: string;
  topic: ClimateTopic;
  level: LearningLevel;
  language: string;
  summary: string;
  content: string;
  estimatedMinutes: number;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    topic: {
      type: String,
      enum: [
        'climate_science',
        'energy',
        'renewable_energy',
        'waste',
        'water',
        'biodiversity',
        'transportation',
        'sustainable_living',
      ],
      required: true,
    },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    language: { type: String, default: 'en' },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    estimatedMinutes: { type: Number, default: 10 },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
