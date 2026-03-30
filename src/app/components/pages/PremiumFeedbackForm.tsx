import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { FeedbackCategory } from '../../types';
import { apiService } from '../../services/api.service';
import { MessageSquare, CheckCircle, Loader2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

export function PremiumFeedbackForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('Bug');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

    setLoading(true);

    try {
      await apiService.createFeedback({
        title,
        description,
        category,
        submitterName: name || undefined,
        submitterEmail: email || undefined
      });

      setSuccess(true);
      toast.success('Feedback submitted successfully! AI analysis complete.');

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Bug');
      setName('');
      setEmail('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const characterCount = description.length;
  const isDescriptionValid = characterCount >= 20;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600 dark:text-sky-400">
                  FeedPulse
                </p>
                <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
                  Build feedback that feels like a product
                </h1>
              </div>
            </div>

            <div className="mt-6 grid gap-6 text-slate-600 dark:text-slate-300">
              <p>
                Collect feedback from users with a polished submission flow, then let AI categorize and prioritize it automatically.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Instant AI</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">Category, sentiment, tags</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">High signal</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-white">Priority scoring and summaries</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Feedback submitted successfully!
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Our AI has analyzed your feedback and it will be reviewed by our team.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-10"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Submit Your Feedback
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Help us improve by sharing your thoughts, reporting bugs, or suggesting new features.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="title" className="text-gray-900 dark:text-white">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your feedback"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  disabled={loading}
                  required
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="description" className="text-gray-900 dark:text-white">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isDescriptionValid
                        ? 'text-green-600 dark:text-green-400'
                        : characterCount > 0
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {characterCount} / 20 min
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your feedback..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  className="min-h-[150px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-sky-500 dark:focus:border-sky-400"
                  required
                />
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((characterCount / 20) * 100, 100)}%` }}
                    className={`h-full transition-colors ${
                      isDescriptionValid
                        ? 'bg-emerald-500'
                        : 'bg-orange-500'
                    }`}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-2"
              >
                <Label htmlFor="category" className="text-gray-900 dark:text-white">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  disabled={loading}
                  required
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                >
                  <option value="Bug">🐛 Bug</option>
                  <option value="Feature Request">✨ Feature Request</option>
                  <option value="Improvement">🚀 Improvement</option>
                  <option value="Other">💬 Other</option>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">
                    Name (optional)
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 dark:text-white">
                    Email (optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
                  size="lg"
                  disabled={loading || !title.trim() || !isDescriptionValid}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Submit Feedback
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>

              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Your feedback will be analyzed by our AI to categorize and prioritize it effectively.
              </p>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = 'login';
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline font-medium transition-colors"
            >
              Admin Login →
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
