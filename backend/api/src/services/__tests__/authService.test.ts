import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { connectDB, disconnectDB } from '../../config/db';
import { AuthService } from '../authService';

describe('AuthService Integration Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('should register a new user successfully with hashed password', async () => {
    const testEmail = `test_${Date.now()}@grevia.edu`;
    const result = await AuthService.signup({
      name: 'Test Student',
      email: testEmail,
      password: 'SecurePassword123!',
      role: 'student',
    });

    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.user.passwordHash).toBeUndefined(); // Ensure passwordHash is sanitized!
    expect(result.tokens.accessToken).toBeDefined();
    expect(result.tokens.refreshToken).toBeDefined();
  });

  it('should fail login with incorrect password', async () => {
    const testEmail = `login_fail_${Date.now()}@grevia.edu`;
    await AuthService.signup({
      name: 'Login Fail Test',
      email: testEmail,
      password: 'CorrectPassword123!',
    });

    await expect(
      AuthService.login({ email: testEmail, password: 'WrongPassword' })
    ).rejects.toThrow('Invalid email or password');
  });
});
