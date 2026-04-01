import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { FeedbackCategory } from '../../types';
import { apiService } from '../../services/api.service';
import { ArrowRight, CheckCircle, Loader2, Mail, Sparkles, User, Rocket, ShieldCheck, Layers, MessageSquare } from 'lucide-react';
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
        submitterEmail: email || undefined,
      });

      setSuccess(true);
      toast.success('Feedback submitted successfully! AI analysis complete.');

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
    <div className="min-h-screen bg-[#081129] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(99,102,241,0.14),_transparent_18%)] pointer-events-none" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">FeedPulse</p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Submit feedback once; AI turns it into instant, actionable insight.
                </h1>
                <p className="mt-4 text-lg leading-8 text-slate-300">
                  A modern feedback workflow that transforms reports into clear priorities, summaries, and follow-up signals powered by AI.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-cyan-500/15 bg-cyan-500/10 p-5 text-cyan-100 shadow-lg shadow-cyan-500/10">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/90">
                  <ShieldCheck className="h-5 w-5" /> Live protection
                </div>
                <p className="mt-3 text-sm text-slate-200 leading-6">
                  Built-in rate limiting stops abuse and keeps your feedback channel healthy.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/30">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500/15 text-cyan-300">
                  <Rocket className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">Instant capture</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Let your team receive ideas, bug reports, and suggestions with no barrier to entry.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/30">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-500/15 text-violet-300">
                  <Layers className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">Insight engine</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Feedback is automatically classified and ranked so your team can focus on the most important issues first.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Bug', value: '🐛', description: 'Real issues' },
                { label: 'Feature', value: '✨', description: 'New ideas' },
                { label: 'Improve', value: '🚀', description: 'Better experiences' },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.75rem] bg-slate-900/80 p-5 text-slate-200 ring-1 ring-white/10">
                  <div className="flex items-center gap-3 text-xl">
                    <span>{item.value}</span>
                    <p className="font-semibold text-white">{item.label}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="space-y-6">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[1.75rem] border border-emerald-500/20 bg-emerald-500/10 p-6 text-emerald-100 shadow-lg shadow-emerald-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Feedback sent successfully</p>
                    <p className="mt-1 text-sm text-slate-300">
                      Your submission is recorded and AI analysis is running in the background.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/20"
            >
              <div className="bg-gradient-to-r from-cyan-500/15 via-slate-950 to-violet-500/10 p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900/70 text-cyan-300">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">Feedback Form</p>
                    <h2 className="mt-2 text-3xl font-semibold text-white">Share what matters</h2>
                  </div>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                  Use the form below to tell us what you need, whether it is a bug, improvement, or new feature request.
                </p>
              </div>

              <div className="px-8 pb-8 pt-6 sm:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-5">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-sm font-medium text-slate-100">Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g. Button label disappears on mobile"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={120}
                        disabled={loading}
                        required
                        className="bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="description" className="text-sm font-medium text-slate-100">Description</Label>
                        <span className={`text-sm ${isDescriptionValid ? 'text-emerald-400' : 'text-amber-300'}`}>
                          {characterCount} / 20 min
                        </span>
                      </div>
                      <Textarea
                        id="description"
                        placeholder="Explain the issue or idea in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        className="min-h-[170px] bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500"
                        required
                      />
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((characterCount / 20) * 100, 100)}%` }}
                          className={`h-full ${isDescriptionValid ? 'bg-emerald-400' : 'bg-amber-300'}`}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="category" className="text-sm font-medium text-slate-100">Category</Label>
                        <Select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                          disabled={loading}
                          required
                          className="bg-slate-900/90 border-slate-800 text-slate-100"
                        >
                          <option value="Bug">🐛 Bug</option>
                          <option value="Feature Request">✨ Feature Request</option>
                          <option value="Improvement">🚀 Improvement</option>
                          <option value="Other">💬 Other</option>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-100">Name</Label>
                        <Input
                          id="name"
                          placeholder="Optional"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={loading}
                          className="bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-100">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Optional"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          className="bg-slate-900/90 border-slate-800 text-slate-100 placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-slate-100">Status</Label>
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400">
                          <p className="font-medium text-slate-100">No sign-in needed</p>
                          <p className="mt-1">Submit anonymously or include contact details if you'd like follow up.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Button
                      type="submit"
                      className="w-full rounded-3xl bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95"
                      size="lg"
                      disabled={loading || !title.trim() || !isDescriptionValid}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending feedback...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Submit feedback
                        </>
                      )}
                    </Button>

                    <div className="grid gap-3 sm:grid-cols-3 text-sm text-slate-400">
                      <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                        <Mail className="h-4 w-4 text-cyan-300" />
                        <span>Optional email</span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                        <User className="h-4 w-4 text-violet-300" />
                        <span>Optional name</span>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-3">
                        <ArrowRight className="h-4 w-4 text-emerald-300" />
                        <span>Rate limited 5/hr</span>
                      </div>
                    </div>

                    <div className="mt-4 text-center text-sm text-slate-300">
                      <button
                        type="button"
                        onClick={() => {
                          window.location.hash = 'login';
                        }}
                        className="font-medium text-cyan-300 hover:text-cyan-200 underline"
                      >
                        Admin login
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
