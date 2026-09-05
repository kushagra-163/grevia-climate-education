import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bio?: string;
  avatarUrl?: string;
  interests: string[];
  streakDays: number;
  lastActiveDate: Date;
  completedLessonsCount: number;
  totalQuizzesTaken: number;
  totalEcoActionsLogged: number;
  estimatedCo2SavedKg: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: 'Climate enthusiast learning to make an impact.' },
    avatarUrl: { type: String, default: '' },
    interests: [{ type: String }],
    streakDays: { type: Number, default: 1 },
    lastActiveDate: { type: Date, default: Date.now },
    completedLessonsCount: { type: Number, default: 0 },
    totalQuizzesTaken: { type: Number, default: 0 },
    totalEcoActionsLogged: { type: Number, default: 0 },
    estimatedCo2SavedKg: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
