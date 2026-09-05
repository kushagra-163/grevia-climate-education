import mongoose, { Schema, Document } from 'mongoose';
import { ClimateTopic, LearningLevel } from './Lesson';

export interface IQuestion {
  _id?: string;
  question: string;
  topic: ClimateTopic;
  level: LearningLevel;
  options: string[];
  correctAnswer: string; // "A" | "B" | "C" | "D"
  explanation: string;
}

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  topic: ClimateTopic;
  difficulty: LearningLevel;
  questions: IQuestion[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  quizId: mongoose.Types.ObjectId;
  topic: ClimateTopic;
  difficulty: LearningLevel;
  answers: string[];
  responseTimes: number[]; // seconds per question
  score: number;
  totalQuestions: number;
  percentage: number;
  pointsEarned: number;
  createdAt: Date;
}

export interface ISkillProfile extends Document {
  userId: mongoose.Types.ObjectId;
  domain: ClimateTopic;
  level: LearningLevel;
  score: number; // 0 to 100
  totalAttempts: number;
  lastUpdated: Date;
}

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  topic: { type: String, required: true },
  level: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
});

const QuizSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: [QuestionSchema],
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const QuizAttemptSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    answers: [{ type: String, required: true }],
    responseTimes: [{ type: Number, required: true }],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    pointsEarned: { type: Number, required: true },
  },
  { timestamps: true }
);

const SkillProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    domain: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    score: { type: Number, default: 50 },
    totalAttempts: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

SkillProfileSchema.index({ userId: 1, domain: 1 }, { unique: true });

export const QuestionModel = mongoose.model<IQuestion & Document>('Question', QuestionSchema);
export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema);
export const SkillProfile = mongoose.model<ISkillProfile>('SkillProfile', SkillProfileSchema);
