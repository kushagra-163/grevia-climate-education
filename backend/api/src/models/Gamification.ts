import mongoose, { Schema, Document } from 'mongoose';

export type EcoActionType =
  | 'used_public_transport'
  | 'recycled_plastic'
  | 'reduced_shower_time'
  | 'used_reusable_bottle'
  | 'planted_tree'
  | 'saved_electricity';

export interface IEcoAction extends Document {
  userId: mongoose.Types.ObjectId;
  type: EcoActionType;
  metadata?: Record<string, any>;
  pointsEarned: number;
  co2SavedKg: number;
  createdAt: Date;
}

export interface IPointsLedger extends Document {
  userId: mongoose.Types.ObjectId;
  source: 'eco_action' | 'quiz_completion' | 'mission_reward';
  points: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IBadge extends Document {
  code: string;
  title: string;
  description: string;
  icon: string;
  category: 'action' | 'learning' | 'quiz' | 'mission';
  requirementType: 'first_action' | 'lessons_count' | 'quizzes_count' | 'high_score' | 'missions_count';
  requirementValue: number;
}

export interface IUserBadge extends Document {
  userId: mongoose.Types.ObjectId;
  badgeId: mongoose.Types.ObjectId;
  badgeCode: string;
  earnedAt: Date;
}

export interface IMission extends Document {
  title: string;
  description: string;
  type: 'solo' | 'community';
  target: number;
  targetUnit: string;
  rewardPoints: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IMissionParticipant extends Document {
  missionId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  progress: number;
  completed: boolean;
  joinedAt: Date;
  completedAt?: Date;
}

const EcoActionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    pointsEarned: { type: Number, required: true },
    co2SavedKg: { type: Number, required: true },
  },
  { timestamps: true }
);

const PointsLedgerSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, enum: ['eco_action', 'quiz_completion', 'mission_reward'], required: true },
    points: { type: Number, required: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const BadgeSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: { type: String, required: true },
    requirementType: { type: String, required: true },
    requirementValue: { type: Number, required: true },
  },
  { timestamps: true }
);

const UserBadgeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: { type: Schema.Types.ObjectId, ref: 'Badge', required: true },
    badgeCode: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

const MissionSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['solo', 'community'], default: 'solo' },
    target: { type: Number, required: true },
    targetUnit: { type: String, required: true },
    rewardPoints: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const MissionParticipantSchema: Schema = new Schema(
  {
    missionId: { type: Schema.Types.ObjectId, ref: 'Mission', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

MissionParticipantSchema.index({ missionId: 1, userId: 1 }, { unique: true });

export const EcoAction = mongoose.model<IEcoAction>('EcoAction', EcoActionSchema);
export const PointsLedger = mongoose.model<IPointsLedger>('PointsLedger', PointsLedgerSchema);
export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);
export const UserBadge = mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);
export const Mission = mongoose.model<IMission>('Mission', MissionSchema);
export const MissionParticipant = mongoose.model<IMissionParticipant>('MissionParticipant', MissionParticipantSchema);
