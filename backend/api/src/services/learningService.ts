import { Lesson, ILesson, ClimateTopic, LearningLevel } from '../models/Lesson';
import { SkillProfile } from '../models/Quiz';
import { AppError } from '../middleware/errorHandler';

export class LearningService {
  static async getLessons(filter: { topic?: ClimateTopic; level?: LearningLevel; language?: string }) {
    const query: any = { isActive: true };
    if (filter.topic) query.topic = filter.topic;
    if (filter.level) query.level = filter.level;
    if (filter.language) query.language = filter.language;

    return await Lesson.find(query).sort({ level: 1, createdAt: -1 });
  }

  static async getLessonById(id: string) {
    const lesson = await Lesson.findById(id);
    if (!lesson || !lesson.isActive) {
      throw new AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
    }
    return lesson;
  }

  static async createLesson(data: Partial<ILesson>) {
    return await Lesson.create(data);
  }

  static async updateLesson(id: string, updates: Partial<ILesson>) {
    const lesson = await Lesson.findByIdAndUpdate(id, updates, { new: true });
    if (!lesson) throw new AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
    return lesson;
  }

  /**
   * Adaptive Personalized Learning Path Algorithm
   * Considers user skill profiles, weak domains, and recommended levels.
   */
  static async getPersonalizedLearningPath(userId: string) {
    const skillProfiles = await SkillProfile.find({ userId });
    const allLessons = await Lesson.find({ isActive: true });

    // Identify weak domains (scores < 60)
    const domainScores: Record<string, number> = {};
    skillProfiles.forEach((sp) => {
      domainScores[sp.domain] = sp.score;
    });

    const weakDomains = Object.keys(domainScores).filter((domain) => domainScores[domain] < 60);

    // Sort lessons prioritizing weak domains first, then lower difficulty
    const recommendedLessons = [...allLessons].sort((a, b) => {
      const aWeak = weakDomains.includes(a.topic) ? 1 : 0;
      const bWeak = weakDomains.includes(b.topic) ? 1 : 0;
      if (aWeak !== bWeak) return bWeak - aWeak;

      const levelScore = { beginner: 1, intermediate: 2, advanced: 3 };
      return levelScore[a.level] - levelScore[b.level];
    });

    return {
      weakDomains,
      domainScores,
      recommendedLessons: recommendedLessons.slice(0, 5),
    };
  }
}
