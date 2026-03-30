import Feedback from '../models/Feedback.js';
import { analyzeWithGemini } from '../services/gemini.service.js';
import { sanitizeFeedbackInput, isValidEmail } from '../utils/sanitize.js';

const validCategories = ['Bug', 'Feature Request', 'Improvement', 'Other'];
const validStatuses = ['New', 'In Review', 'Resolved'];

function mapFeedbackPayload(item) {
  return {
    ...item.toObject({ versionKey: false }),
    id: item._id,
  };
}

export const createFeedback = async (req, res) => {
  const input = sanitizeFeedbackInput(req.body);
  const { title, description, category, submitterName, submitterEmail } = input;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Title and description are required',
      message: 'Missing required feedback fields',
    });
  }

  if (description.length < 20) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Description must be at least 20 characters',
      message: 'Validation failed',
    });
  }

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Invalid category',
      message: 'Validation failed',
    });
  }

  if (submitterEmail && !isValidEmail(submitterEmail)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Invalid email address',
      message: 'Validation failed',
    });
  }

  const feedback = new Feedback({
    title,
    description,
    category,
    submitterName,
    submitterEmail,
  });

  const analysis = await analyzeWithGemini(title, description);
  feedback.ai_category = analysis.category;
  feedback.ai_sentiment = analysis.sentiment;
  feedback.ai_priority = analysis.priority_score;
  feedback.ai_summary = analysis.summary;
  feedback.ai_tags = analysis.tags;
  feedback.ai_processed = analysis.ai_processed;

  await feedback.save();

  return res.status(201).json({
    success: true,
    data: mapFeedbackPayload(feedback),
    error: null,
    message: 'Feedback submitted successfully',
  });
};

export const getFeedbackList = async (req, res) => {
  const { category, status, search, sort = 'createdAt', order = 'desc', page = '1', limit = '50' } = req.query;

  const query = {};
  if (category && validCategories.includes(category)) {
    query.category = category;
  }

  if (status && validStatuses.includes(status)) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { ai_summary: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = order === 'asc' ? 1 : -1;
  const pageNumber = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const feedbackItems = await Feedback.find(query)
    .sort({ [sort]: sortOrder })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  return res.status(200).json({
    success: true,
    data: feedbackItems.map((item) => mapFeedbackPayload(item)),
    error: null,
    message: 'Feedback list retrieved',
  });
};

export const getFeedbackById = async (req, res) => {
  const { id } = req.params;
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    return res.status(404).json({
      success: false,
      data: null,
      error: 'Feedback not found',
      message: 'No feedback entry matches the provided ID',
    });
  }

  return res.status(200).json({
    success: true,
    data: mapFeedbackPayload(feedback),
    error: null,
    message: 'Feedback retrieved',
  });
};

export const updateFeedbackStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Invalid status value',
      message: 'Validation failed',
    });
  }

  const feedback = await Feedback.findById(id);
  if (!feedback) {
    return res.status(404).json({
      success: false,
      data: null,
      error: 'Feedback not found',
      message: 'No feedback entry matches the provided ID',
    });
  }

  feedback.status = status;
  await feedback.save();

  return res.status(200).json({
    success: true,
    data: mapFeedbackPayload(feedback),
    error: null,
    message: 'Feedback status updated',
  });
};

export const reanalyzeFeedback = async (req, res) => {
  const { id } = req.params;
  const feedback = await Feedback.findById(id);

  if (!feedback) {
    return res.status(404).json({
      success: false,
      data: null,
      error: 'Feedback not found',
      message: 'No feedback entry matches the provided ID',
    });
  }

  const analysis = await analyzeWithGemini(feedback.title, feedback.description);
  feedback.ai_category = analysis.category;
  feedback.ai_sentiment = analysis.sentiment;
  feedback.ai_priority = analysis.priority_score;
  feedback.ai_summary = analysis.summary;
  feedback.ai_tags = analysis.tags;
  feedback.ai_processed = analysis.ai_processed;

  await feedback.save();

  return res.status(200).json({
    success: true,
    data: mapFeedbackPayload(feedback),
    error: null,
    message: 'AI analysis re-run successfully',
  });
};

export const getWeeklySummary = async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentFeedback = await Feedback.find({ createdAt: { $gte: sevenDaysAgo } });

  const total = recentFeedback.length;
  const tagCounts = {};
  const categoryCounts = {};

  recentFeedback.forEach((item) => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    item.ai_tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  const summary = total === 0
    ? 'No feedback has been submitted in the last 7 days.'
    : `In the last 7 days we received ${total} submissions. The most common category was ${topCategory ? topCategory[0] : 'N/A'} and the top themes were ${topTags.length > 0 ? topTags.join(', ') : 'none yet'}.`;

  return res.status(200).json({
    success: true,
    data: {
      total,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      topTags,
      summary,
    },
    error: null,
    message: 'Weekly feedback summary generated',
  });
};
