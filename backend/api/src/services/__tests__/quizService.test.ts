import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { QuizService } from '../quizService';
import { connectDB, disconnectDB } from '../../config/db';
import { User } from '../../models/User';

describe('QuizService Adaptive Engine Tests', () => {
  let userId: string;

  beforeAll(async () => {
    await connectDB();
    const student = await User.findOne({ email: 'student@grevia.edu' });
    if (student) {
      userId = student._id.toString();
    } else {
      const newStudent = await User.create({
        name: 'Test Student',
        email: `quiz_test_${Date.now()}@grevia.edu`,
        passwordHash: 'hashed',
        city: 'Nashik',
        country: 'India',
      });
      userId = newStudent._id.toString();
    }
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('should sanitize quiz before rendering to hide correct answers', () => {
    const rawQuiz = {
      _id: 'quiz-123',
      topic: 'energy',
      difficulty: 'intermediate',
      questions: [
        {
          question: 'What is solar power?',
          options: ['Sunlight', 'Coal', 'Gas', 'Wind'],
          correctAnswer: 'A',
          explanation: 'Solar panels convert photons into electricity.',
        },
      ],
    };

    const sanitized = QuizService.sanitizeQuizForDisplay(rawQuiz);
    expect(sanitized.questions[0].question).toBe('What is solar power?');
    expect(sanitized.questions[0].correctAnswer).toBeUndefined(); // MUST NOT expose answer!
    expect(sanitized.questions[0].explanation).toBeUndefined(); // MUST NOT expose explanation!
  });

  it('should generate 5 unique questions for a topic without exposing answers', async () => {
    const quiz = await QuizService.generateQuiz({ userId, topic: 'energy', numQuestions: 5 });
    expect(quiz).toBeDefined();
    expect(quiz.questions.length).toBe(5);

    const questionTexts = new Set(quiz.questions.map((q) => q.question));
    expect(questionTexts.size).toBe(5); // All 5 questions must be unique!

    const sanitized = QuizService.sanitizeQuizForDisplay(quiz);
    sanitized.questions.forEach((q: any) => {
      expect(q.correctAnswer).toBeUndefined();
      expect(q.explanation).toBeUndefined();
    });
  });

  it('should calculate quiz score percentage with mathematical precision', async () => {
    const quiz = await QuizService.generateQuiz({ userId, topic: 'climate_science', numQuestions: 5 });
    const correctAnswers = quiz.questions.map((q) => q.correctAnswer);

    // Provide 4 correct answers out of 5
    const userAnswers = [...correctAnswers];
    userAnswers[4] = 'WRONG_CHOICE';

    const result = await QuizService.submitQuiz(userId, quiz._id.toString(), {
      answers: userAnswers,
      responseTimes: [5, 6, 7, 8, 9],
    });

    expect(result.score).toBe(4);
    expect(result.totalQuestions).toBe(5);
    expect(result.percentage).toBe(80); // 4 / 5 = 80%
    expect(result.pointsEarned).toBeGreaterThan(0);
  });

  it('should support correct answer positions across A, B, C, and D with option shuffling', async () => {
    const quiz = await QuizService.generateQuiz({ userId, topic: 'renewable_energy', numQuestions: 5 });
    const correctAnswers = quiz.questions.map((q) => q.correctAnswer);

    // Verify correct answers use valid letters A, B, C, D
    correctAnswers.forEach((ans) => {
      expect(['A', 'B', 'C', 'D']).toContain(ans);
    });

    // Test 100% score submission
    const result = await QuizService.submitQuiz(userId, quiz._id.toString(), {
      answers: correctAnswers,
      responseTimes: [4, 5, 6, 5, 4],
    });

    expect(result.score).toBe(5);
    expect(result.percentage).toBe(100);
    expect(result.detailedResults.every((r: any) => r.isCorrect)).toBe(true);
  });
});
