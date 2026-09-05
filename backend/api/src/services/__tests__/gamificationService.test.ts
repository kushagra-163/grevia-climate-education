import { describe, it, expect } from 'vitest';
import { GamificationService } from '../gamificationService';

describe('GamificationService Logic Tests', () => {
  it('should calculate correct points for eco actions', () => {
    const transport = GamificationService.calculateActionPoints('used_public_transport');
    expect(transport.points).toBe(50);
    expect(transport.co2SavedKg).toBe(2.5);

    const tree = GamificationService.calculateActionPoints('planted_tree');
    expect(tree.points).toBe(150);
    expect(tree.co2SavedKg).toBe(20.0);
  });

  it('should calculate quiz completion points with difficulty multipliers', () => {
    const beginnerPoints = GamificationService.calculateQuizPoints(5, 5, 'beginner');
    const advancedPoints = GamificationService.calculateQuizPoints(5, 5, 'advanced');

    expect(advancedPoints).toBeGreaterThan(beginnerPoints);
  });
});
