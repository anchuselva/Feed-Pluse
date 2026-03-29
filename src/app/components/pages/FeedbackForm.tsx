import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { FeedbackCategory } from '../../types';
import { apiService } from '../../services/api.service';
import { MessageSquare, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

export function FeedbackForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('Bug');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (description.length < 20) {
      setError('Description must be at least 20 characters');
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
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Bug');
      setName('');
      setEmail('');

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const characterCount = description.length;
  const isDescriptionValid = characterCount >= 20;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600 text-white mb-4">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FeedPulse</h1>
          <p className="text-lg text-gray-600">AI-Powered Product Feedback Platform</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">Feedback submitted successfully!</p>
              <p className="text-sm text-green-700">Our AI has analyzed your feedback and it will be reviewed by our team.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Submit Your Feedback</CardTitle>
            <CardDescription>
              Help us improve by sharing your thoughts, reporting bugs, or suggesting new features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
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
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <span className={`text-sm ${isDescriptionValid ? 'text-gray-500' : 'text-red-500'}`}>
                    {characterCount} / 20 min
                  </span>
                </div>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your feedback..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  className="min-h-[150px]"
                  required
                />
                {characterCount > 0 && !isDescriptionValid && (
                  <p className="text-sm text-red-500">Please enter at least 20 characters</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  disabled={loading}
                  required
                >
                  <option value="Bug">Bug</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Improvement">Improvement</option>
                  <option value="Other">Other</option>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || !title.trim() || !isDescriptionValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing with AI...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                Your feedback will be analyzed by our AI to categorize and prioritize it effectively.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = 'login';
            }}
            className="text-sm text-indigo-600 hover:text-indigo-700 underline"
          >
            Admin Login
          </a>
        </div>
      </div>
    </div>
  );
}
