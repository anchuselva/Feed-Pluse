import rateLimit from 'express-rate-limit';

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      data: null,
      error: 'Too many submissions from this IP address',
      message: 'Please try again in one hour',
    });
  },
});
