import { EcoAction, EcoActionType, PointsLedger, Badge, UserBadge, Mission, MissionParticipant } from '../models/Gamification';
import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { QuizAttempt } from '../models/Quiz';
import { redisClient } from '../config/redis';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

export class GamificationService {
  static calculateActionPoints(type: EcoActionType): { points: number; co2SavedKg: number } {
    const table: Record<EcoActionType, { points: number; co2SavedKg: number }> = {
      used_public_transport: { points: 50, co2SavedKg: 2.5 },
      recycled_plastic: { points: 30, co2SavedKg: 0.8 },
      reduced_shower_time: { points: 25, co2SavedKg: 1.2 },
      used_reusable_bottle: { points: 20, co2SavedKg: 0.5 },
      planted_tree: { points: 150, co2SavedKg: 20.0 },
      saved_electricity: { points: 40, co2SavedKg: 3.0 },
    };
    return table[type] || { points: 20, co2SavedKg: 1.0 };
  }

  static calculateQuizPoints(correctCount: number, total: number, difficulty: string): number {
    const base = correctCount * 10;
    const multiplier = difficulty === 'advanced' ? 1.5 : difficulty === 'intermediate' ? 1.2 : 1.0;
    const bonus = correctCount === total ? 25 : 0;
    return Math.round(base * multiplier + bonus);
  }

  static async awardPoints(
    userId: string,
    source: 'eco_action' | 'quiz_completion' | 'mission_reward',
    points: number,
    description: string,
    metadata?: Record<string, any>
  ) {
    if (points <= 0) return;

    // Create ledger entry
    const ledger = await PointsLedger.create({
      userId: new mongoose.Types.ObjectId(userId),
      source,
      points,
      description,
      metadata: metadata || {},
    });

    // Increment user total points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true }
    );

    if (user) {
      // Update Redis sorted set for leaderboard
      await redisClient.zadd('leaderboard:global', user.points, user._id.toString());
      if (user.classId) {
        await redisClient.zadd(`leaderboard:class:${user.classId}`, user.points, user._id.toString());
      }
      if (user.schoolId) {
        await redisClient.zadd(`leaderboard:school:${user.schoolId}`, user.points, user._id.toString());
      }
    }

    return ledger;
  }

  static async logEcoAction(userId: string, type: EcoActionType, metadata?: Record<string, any>) {
    const { points, co2SavedKg } = this.calculateActionPoints(type);

    const action = await EcoAction.create({
      userId: new mongoose.Types.ObjectId(userId),
      type,
      metadata: metadata || {},
      pointsEarned: points,
      co2SavedKg,
    });

    await UserProfile.findOneAndUpdate(
      { userId },
      {
        $inc: {
          totalEcoActionsLogged: 1,
          estimatedCo2SavedKg: co2SavedKg,
        },
      }
    );

    await this.awardPoints(
      userId,
      'eco_action',
      points,
      `Logged eco-action: ${type.replace(/_/g, ' ')}`,
      { actionId: action._id.toString(), type, co2SavedKg }
    );

    await this.evaluateBadges(userId);

    return action;
  }

  static async evaluateBadges(userId: string) {
    const badges = await Badge.find();
    const existingUserBadges = await UserBadge.find({ userId });
    const earnedCodes = new Set(existingUserBadges.map((ub) => ub.badgeCode));

    const user = await User.findById(userId);
    const profile = await UserProfile.findOne({ userId });
    const quizAttempts = await QuizAttempt.countDocuments({ userId });
    const ecoActionsCount = await EcoAction.countDocuments({ userId });

    for (const badge of badges) {
      if (earnedCodes.has(badge.code)) continue;

      let isEligible = false;
      switch (badge.requirementType) {
        case 'first_action':
          isEligible = ecoActionsCount >= 1;
          break;
        case 'lessons_count':
          isEligible = (profile?.completedLessonsCount || 0) >= badge.requirementValue;
          break;
        case 'quizzes_count':
          isEligible = quizAttempts >= badge.requirementValue;
          break;
        case 'high_score':
          isEligible = (user?.points || 0) >= badge.requirementValue;
          break;
        case 'missions_count':
          const completedMissions = await MissionParticipant.countDocuments({ userId, completed: true });
          isEligible = completedMissions >= badge.requirementValue;
          break;
      }

      if (isEligible) {
        await UserBadge.create({
          userId: new mongoose.Types.ObjectId(userId),
          badgeId: badge._id,
          badgeCode: badge.code,
        });
      }
    }

    return await UserBadge.find({ userId }).populate('badgeId');
  }

  static async getLeaderboard(scope: 'global' | 'class' | 'school' = 'global', scopeId?: string, limit = 20, offset = 0) {
    let redisKey = 'leaderboard:global';
    const query: any = {};

    if (scope === 'class' && scopeId) {
      redisKey = `leaderboard:class:${scopeId}`;
      query.classId = scopeId;
    } else if (scope === 'school' && scopeId) {
      redisKey = `leaderboard:school:${scopeId}`;
      query.schoolId = scopeId;
    }

    // Try Redis first
    const redisEntries = await redisClient.zrevrange(redisKey, offset, offset + limit - 1);
    if (redisEntries.length > 0) {
      const userIds = redisEntries.map((e) => e.member);
      const users = await User.find({ _id: { $in: userIds } }).select('name email points classId city country');
      const userMap = new Map(users.map((u) => [u._id.toString(), u]));

      return redisEntries.map((entry, idx) => {
        const u = userMap.get(entry.member);
        return {
          rank: offset + idx + 1,
          userId: entry.member,
          userName: u ? u.name : 'Climate Learner',
          points: entry.score,
          city: u?.city || 'Earth',
          country: u?.country || 'Global',
        };
      });
    }

    // Fallback to MongoDB query
    const users = await User.find(query)
      .select('name email points classId city country')
      .sort({ points: -1 })
      .skip(offset)
      .limit(limit);

    return users.map((u, idx) => ({
      rank: offset + idx + 1,
      userId: u._id.toString(),
      userName: u.name,
      points: u.points,
      city: u.city,
      country: u.country,
    }));
  }

  static async getMissions() {
    return await Mission.find({ isActive: true }).sort({ createdAt: -1 });
  }

  static async joinMission(userId: string, missionId: string) {
    const mission = await Mission.findById(missionId);
    if (!mission || !mission.isActive) {
      throw new AppError('Mission not available', 404, 'MISSION_NOT_FOUND');
    }

    const existing = await MissionParticipant.findOne({ userId, missionId });
    if (existing) {
      return existing;
    }

    return await MissionParticipant.create({
      userId: new mongoose.Types.ObjectId(userId),
      missionId: new mongoose.Types.ObjectId(missionId),
      progress: 0,
      completed: false,
    });
  }

  static async getUserMissions(userId: string) {
    return await MissionParticipant.find({ userId }).populate('missionId');
  }
}
