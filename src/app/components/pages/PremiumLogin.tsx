import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { apiService } from '../../services/api.service';
import { Lock, Loader2, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface PremiumLoginProps {
  onLoginSuccess: () => void;
}

export function PremiumLogin({ onLoginSuccess }: PremiumLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.login({ email, password });
      toast.success('Welcome back! Redirecting to dashboard...');
      setTimeout(onLoginSuccess, 500);
    } catch (err) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-600 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-400">Admin Access</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">Sign in to FeedPulse</h1>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Restrict access to product feedback management and AI review tools.
            </p>
          </motion.div>

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Sign In
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-gray-900 dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@feedpulse.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-gray-900 dark:text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Sign In
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 backdrop-blur-sm rounded-2xl border border-indigo-100 dark:border-indigo-900/50"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Demo Credentials
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Use these credentials to access the dashboard
                  </p>
                </div>
              </div>
              <div className="space-y-1.5 pl-11">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Email:</span>
                  <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-gray-800/50 px-2 py-0.5 rounded">
                    admin@feedpulse.com
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Password:</span>
                  <code className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-white/50 dark:bg-gray-800/50 px-2 py-0.5 rounded">
                    admin123
                  </code>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline font-medium transition-colors"
            >
              ← Back to Feedback Form
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
