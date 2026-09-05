import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectDB, disconnectDB } from '../../config/db';
import { ClimateService } from '../climateService';

describe('ClimateService Location Consistency Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('should return Nashik, India when city is Nashik and country is India', async () => {
    const snapshot = await ClimateService.getCurrentClimate('Nashik', 'India');
    expect(snapshot).toBeDefined();
    expect(snapshot.location.city.toLowerCase()).toBe('nashik');
    expect(snapshot.location.country).toBe('India');
    expect(snapshot.location.country).not.toBe('Germany');
  });

  it('should resolve mapped country for known cities when country is omitted', async () => {
    const snapshot = await ClimateService.getCurrentClimate('Nashik');
    expect(snapshot.location.country).toBe('India');
  });
});
