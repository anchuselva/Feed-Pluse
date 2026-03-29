import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 180,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: ['Bug', 'Feature Request', 'Improvement', 'Other'],
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Resolved'],
      default: 'New',
    },
    submitterName: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    submitterEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
    ai_category: {
      type: String,
      trim: true,
      default: 'Other',
    },
    ai_sentiment: {
      type: String,
      enum: ['Positive', 'Neutral', 'Negative'],
      default: 'Neutral',
    },
    ai_priority: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    ai_summary: {
      type: String,
      trim: true,
      default: '',
    },
    ai_tags: {
      type: [String],
      default: [],
    },
    ai_processed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ ai_priority: 1 });
FeedbackSchema.index({ createdAt: -1 });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
