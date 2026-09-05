import { User } from '../models/User';
import { UserProfile } from '../models/UserProfile';
import { SkillProfile } from '../models/Quiz';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  static async getUserById(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user;
  }

  static async getUserProfile(userId: string) {
    let profile = await UserProfile.findOne({ userId });
    if (!profile) {
      profile = await UserProfile.create({ userId });
    }
    return profile;
  }

  static async updateUser(userId: string, updates: Partial<any>) {
    const allowed = ['name', 'age', 'country', 'city', 'language', 'classId', 'baselineAwarenessScore'];
    const filtered: Record<string, any> = {};
    for (const key of Object.keys(updates)) {
      if (allowed.includes(key)) {
        filtered[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true });
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return user;
  }

  static async updateUserProfile(userId: string, updates: Partial<any>) {
    const profile = await UserProfile.findOneAndUpdate({ userId }, updates, { new: true, upsert: true });
    return profile;
  }

  static async getSkillProfiles(userId: string) {
    return await SkillProfile.find({ userId });
  }
}
