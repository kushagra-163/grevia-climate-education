import rateLimit from 'express-rate-limit';

export const generalRateLimiter: any = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'TOO_MANY_REQUESTS',
    },
  },
});

export const authRateLimiter: any = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT',
    },
  },
});

export const aiRateLimiter: any = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'AI request limit reached. Please wait a moment before sending another prompt.',
      code: 'AI_RATE_LIMIT',
    },
  },
});
