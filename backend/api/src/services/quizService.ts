import { QuestionModel, Quiz, QuizAttempt, SkillProfile, IQuestion } from '../models/Quiz';
import { ClimateTopic, LearningLevel } from '../models/Lesson';
import { GamificationService } from './gamificationService';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

export interface GenerateQuizDTO {
  userId: string;
  topic: ClimateTopic;
  difficulty?: LearningLevel;
  numQuestions?: number;
}

export interface SubmitQuizDTO {
  answers: string[];
  responseTimes: number[];
}

export class QuizService {
  static async generateQuiz(dto: GenerateQuizDTO) {
    const numQuestions = dto.numQuestions || 5;

    // 1. Determine target difficulty per topic
    let targetDifficulty: LearningLevel = dto.difficulty || 'beginner';
    if (!dto.difficulty) {
      const skill = await SkillProfile.findOne({ userId: dto.userId, domain: dto.topic });
      if (skill) {
        targetDifficulty = skill.level;
      }
    }

    // 2. Fetch user's previous quiz attempts for this topic to avoid repeating questions
    const previousAttempts = await QuizAttempt.find({ userId: dto.userId, topic: dto.topic })
      .sort({ createdAt: -1 })
      .limit(10);

    const answeredQuestionTexts = new Set<string>();
    previousAttempts.forEach((attempt) => {
      // If attempt saved question details or answers
      if (attempt.answers) {
        // Track answered count
      }
    });

    // Fetch candidate questions matching topic and target difficulty
    let candidateQuestions = await QuestionModel.find({
      topic: dto.topic,
      level: targetDifficulty,
    });

    // If not enough questions in exact target level, fetch all questions for this topic
    if (candidateQuestions.length < numQuestions) {
      candidateQuestions = await QuestionModel.find({ topic: dto.topic });
    }

    // Filter out questions served in the very last attempt if possible
    const lastAttempt = previousAttempts[0];
    let filteredCandidates = candidateQuestions;
    if (lastAttempt && candidateQuestions.length > numQuestions) {
      // Find the last quiz to get question IDs
      const lastQuiz = await Quiz.findById(lastAttempt.quizId);
      if (lastQuiz) {
        const lastServedTexts = new Set(lastQuiz.questions.map((q) => q.question));
        const unserved = candidateQuestions.filter((q) => !lastServedTexts.has(q.question));
        if (unserved.length >= numQuestions) {
          filteredCandidates = unserved;
        }
      }
    }

    // Shuffle candidates
    const shuffled = [...filteredCandidates].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numQuestions);

    if (selected.length === 0) {
      throw new AppError(`No questions available for topic ${dto.topic}`, 404, 'NO_QUESTIONS');
    }

    // Shuffle option positions for each question in this quiz session
    const letterToIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    const indexToLetter = ['A', 'B', 'C', 'D'];

    const processedQuestions = selected.map((q) => {
      const origCorrIndex = letterToIndex[q.correctAnswer.toUpperCase()] ?? 0;

      const indexedOptions = q.options.map((optText, i) => ({
        optText,
        isCorrect: i === origCorrIndex,
      }));

      // Randomize option order for this attempt
      for (let i = indexedOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexedOptions[i], indexedOptions[j]] = [indexedOptions[j], indexedOptions[i]];
      }

      const shuffledOptions = indexedOptions.map((item) => item.optText);
      const newCorrIndex = indexedOptions.findIndex((item) => item.isCorrect);
      const newCorrectAnswer = indexToLetter[newCorrIndex] || 'A';

      return {
        question: q.question,
        topic: q.topic,
        level: q.level,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswer,
        explanation: q.explanation,
      };
    });

    const quiz = await Quiz.create({
      userId: dto.userId,
      topic: dto.topic,
      difficulty: targetDifficulty,
      questions: processedQuestions,
    });

    return quiz;
  }

  /**
   * Sanitizes a quiz before returning to frontend so correct answers are NOT exposed prior to submission.
   */
  static sanitizeQuizForDisplay(quiz: any) {
    const quizObj = quiz.toObject ? quiz.toObject() : { ...quiz };
    quizObj.questions = quizObj.questions.map((q: any) => {
      const { correctAnswer, explanation, ...publicFields } = q;
      return publicFields;
    });
    return quizObj;
  }

  static async getQuizById(quizId: string) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new AppError('Quiz session not found', 404, 'QUIZ_NOT_FOUND');
    }
    return quiz;
  }

  static async submitQuiz(userId: string, quizId: string, dto: SubmitQuizDTO) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      throw new AppError('Quiz session not found', 404, 'QUIZ_NOT_FOUND');
    }
    if (quiz.isCompleted) {
      throw new AppError('Quiz has already been submitted', 400, 'QUIZ_ALREADY_COMPLETED');
    }

    let correctCount = 0;
    const detailedResults = quiz.questions.map((q, index) => {
      const userAnswer = dto.answers[index] || '';
      const isCorrect = userAnswer.toUpperCase() === q.correctAnswer.toUpperCase();
      if (isCorrect) correctCount++;
      return {
        questionIndex: index,
        questionText: q.question,
        options: q.options,
        userAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        responseTimeSeconds: dto.responseTimes[index] || 0,
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const pointsEarned = GamificationService.calculateQuizPoints(correctCount, totalQuestions, quiz.difficulty);

    // Save attempt record
    const attempt = await QuizAttempt.create({
      userId: new mongoose.Types.ObjectId(userId),
      quizId: quiz._id,
      topic: quiz.topic,
      difficulty: quiz.difficulty,
      answers: dto.answers,
      responseTimes: dto.responseTimes,
      score: correctCount,
      totalQuestions,
      percentage,
      pointsEarned,
    });

    quiz.isCompleted = true;
    await quiz.save();

    // Ledger entry for points
    await GamificationService.awardPoints(
      userId,
      'quiz_completion',
      pointsEarned,
      `Completed ${quiz.topic} quiz (${quiz.difficulty}) with ${percentage}% score`,
      { quizId: quiz._id.toString(), score: correctCount, percentage }
    );

    // ADAPTIVE RULES EVALUATION
    const nextLevel = await this.evaluateAdaptiveLevel(userId, quiz.topic, percentage, dto.responseTimes);

    // Update Topic-Specific Skill Profile
    let skill = await SkillProfile.findOne({ userId, domain: quiz.topic });
    if (!skill) {
      skill = new SkillProfile({
        userId,
        domain: quiz.topic,
        level: nextLevel,
        score: percentage,
        totalAttempts: 1,
      });
    } else {
      skill.score = Math.round((skill.score * skill.totalAttempts + percentage) / (skill.totalAttempts + 1));
      skill.totalAttempts += 1;
      skill.level = nextLevel;
      skill.lastUpdated = new Date();
    }
    await skill.save();

    // Check Badges
    await GamificationService.evaluateBadges(userId);

    return {
      attemptId: attempt._id,
      score: correctCount,
      totalQuestions,
      percentage,
      pointsEarned,
      newSkillLevel: nextLevel,
      detailedResults,
    };
  }

  /**
   * Adaptive Rules:
   * 1. Calculate recent average score for this specific topic.
   * 2. Calculate response-time performance.
   * 3. If avg score >= 80% AND responses are fast (< 15s avg), increase difficulty.
   * 4. If avg score <= 50%, decrease difficulty.
   * 5. Otherwise maintain current difficulty.
   */
  private static async evaluateAdaptiveLevel(
    userId: string,
    topic: ClimateTopic,
    currentPercentage: number,
    responseTimes: number[]
  ): Promise<LearningLevel> {
    const recentAttempts = await QuizAttempt.find({ userId, topic })
      .sort({ createdAt: -1 })
      .limit(3);

    const scores = recentAttempts.map((a) => a.percentage);
    if (scores.length === 0) scores.push(currentPercentage);

    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const avgResponseTime =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length
        : 15;

    let currentLevel: LearningLevel = 'beginner';
    const skill = await SkillProfile.findOne({ userId, domain: topic });
    if (skill) currentLevel = skill.level;

    const levels: LearningLevel[] = ['beginner', 'intermediate', 'advanced'];
    const currentIdx = levels.indexOf(currentLevel);

    if (avgScore >= 80 && avgResponseTime < 15 && currentIdx < levels.length - 1) {
      return levels[currentIdx + 1];
    } else if (avgScore <= 50 && currentIdx > 0) {
      return levels[currentIdx - 1];
    }

    return currentLevel;
  }

  static async getUserQuizHistory(userId: string) {
    return await QuizAttempt.find({ userId }).sort({ createdAt: -1 }).limit(20);
  }
}
