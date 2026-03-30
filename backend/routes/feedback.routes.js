import express from 'express';
import {
  createFeedback,
  getFeedbackList,
  getFeedbackById,
  updateFeedbackStatus,
  reanalyzeFeedback,
  getWeeklySummary,
} from '../controllers/feedback.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { feedbackLimiter } from '../middlewares/feedbackRateLimiter.js';

const router = express.Router();

router.post('/', feedbackLimiter, createFeedback);
router.get('/weekly-summary', requireAuth, getWeeklySummary);
router.get('/', requireAuth, getFeedbackList);
router.get('/:id', requireAuth, getFeedbackById);
router.patch('/:id/status', requireAuth, updateFeedbackStatus);
router.post('/:id/analyze', requireAuth, reanalyzeFeedback);

export default router;
