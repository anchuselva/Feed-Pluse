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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 dark:from-indigo-600/20 dark:to-purple-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 dark:from-purple-600/20 dark:to-pink-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white mb-6 shadow-2xl shadow-indigo-500/50"
            >
              <Sparkles className="w-10 h-10" />
            </motion.div>

            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              FeedPulse
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              AI-Powered Product Feedback Platform
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your feedback, intelligently analyzed and prioritized
            </p>
          </motion.div>

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
            className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-3xl shadow-2xl p-8 md:p-10"
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
                  className="min-h-[150px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
                  required
                />
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((characterCount / 20) * 100, 100)}%` }}
                    className={`h-full transition-colors ${
                      isDescriptionValid
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-orange-500 to-red-500'
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
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 group"
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
