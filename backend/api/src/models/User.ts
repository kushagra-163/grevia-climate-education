import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'teacher' | 'admin';
  age?: number;
  country?: string;
  city?: string;
  language: string;
  classId?: string;
  schoolId?: string;
  baselineAwarenessScore: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    age: { type: Number },
    country: { type: String, default: 'Global' },
    city: { type: String, default: 'Earth' },
    language: { type: String, default: 'en' },
    classId: { type: String, default: 'default-class' },
    schoolId: { type: String, default: 'default-school' },
    baselineAwarenessScore: { type: Number, default: 50 },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
