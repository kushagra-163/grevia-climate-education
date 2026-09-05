import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { QuizAttempt } from '../models/Quiz';
import { EcoAction } from '../models/Gamification';

export class AnalyticsService {
  static async getUserAnalytics(userId: string) {
    const profile = await UserProfile.findOne({ userId });
    const attempts = await QuizAttempt.find({ userId });
    const actions = await EcoAction.find({ userId });

    const totalQuizzes = attempts.length;
    const avgScore = totalQuizzes > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzes)
      : 0;

    return {
      userId,
      totalQuizzes,
      avgScore,
      totalEcoActions: actions.length,
      estimatedCo2SavedKg: profile?.estimatedCo2SavedKg || 0,
      completedLessons: profile?.completedLessonsCount || 0,
      streakDays: profile?.streakDays || 0,
      lastActive: profile?.lastActiveDate || new Date(),
    };
  }

  static async getClassAnalytics(classId: string) {
    const students = await User.find({ classId });
    const studentIds = students.map((s) => s._id);

    const attempts = await QuizAttempt.find({ userId: { $in: studentIds } });
    const actions = await EcoAction.find({ userId: { $in: studentIds } });

    const totalPoints = students.reduce((sum, s) => sum + s.points, 0);
    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0;

    return {
      classId,
      totalStudents: students.length,
      totalPoints,
      avgScore,
      totalQuizzesTaken: attempts.length,
      totalEcoActionsLogged: actions.length,
      totalCo2SavedKg: actions.reduce((sum, a) => sum + a.co2SavedKg, 0),
    };
  }

  static async getCommunityAnalytics() {
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await QuizAttempt.countDocuments();
    const totalActions = await EcoAction.countDocuments();

    const aggregateActions = await EcoAction.aggregate([
      { $group: { _id: null, totalCo2: { $sum: '$co2SavedKg' }, totalPoints: { $sum: '$pointsEarned' } } },
    ]);

    return {
      totalUsers,
      totalQuizzesCompleted: totalQuizzes,
      totalEcoActionsLogged: totalActions,
      totalCo2SavedKg: aggregateActions[0]?.totalCo2 || 0,
      totalPointsAwarded: aggregateActions[0]?.totalPoints || 0,
    };
  }
}
