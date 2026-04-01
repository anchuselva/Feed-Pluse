import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Feedback, FeedbackCategory, FeedbackStatus, Sentiment } from '../../types';
import { apiService } from '../../services/api.service';
import { formatDate } from '../../lib/utils';
import {
  MessageSquare,
  LogOut,
  Search,
  Filter,
  TrendingUp,
  CheckCircle,
  Clock,
  Tag,
  Loader2,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeedback();
  }, [categoryFilter, statusFilter, searchQuery]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const { items } = await apiService.getFeedback({
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        search: searchQuery || undefined
      });
      setFeedback(items);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: FeedbackStatus) => {
    try {
      await apiService.updateFeedbackStatus(id, newStatus);
      toast.success('Status updated successfully');
      loadFeedback();

      // Update selected feedback if it's open
      if (selectedFeedback && selectedFeedback.id === id) {
        const updated = await apiService.getFeedbackById(id);
        setSelectedFeedback(updated);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // Calculate stats
  const stats = {
    total: feedback.length,
    open: feedback.filter(f => f.status !== 'Resolved').length,
    avgPriority: feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.ai_priority, 0) / feedback.length).toFixed(1)
      : '0',
    mostCommonTag: (() => {
      const tagCounts: Record<string, number> = {};
      feedback.forEach(f => {
        f.ai_tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      const entries = Object.entries(tagCounts);
      if (entries.length === 0) return 'N/A';
      return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
    })()
  };

  const getSentimentColor = (sentiment: Sentiment): 'success' | 'warning' | 'danger' => {
    switch (sentiment) {
      case 'Positive': return 'success';
      case 'Neutral': return 'warning';
      case 'Negative': return 'danger';
    }
  };

  const getCategoryColor = (category: FeedbackCategory): 'default' | 'danger' | 'success' | 'secondary' => {
    switch (category) {
      case 'Bug': return 'danger';
      case 'Feature Request': return 'success';
      case 'Improvement': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: number): string => {
    if (priority >= 8) return 'text-red-600';
    if (priority >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FeedPulse</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Feedback</CardTitle>
              <MessageSquare className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Open Items</CardTitle>
              <Clock className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.open}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Priority</CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgPriority}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Tag</CardTitle>
              <Tag className="w-4 h-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">{stats.mostCommonTag}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as FeedbackCategory | '')}
              >
                <option value="">All Categories</option>
                <option value="Bug">Bug</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Improvement">Improvement</option>
                <option value="Other">Other</option>
              </Select>

              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FeedbackStatus | '')}
              >
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
              </Select>
            </div>

            {(categoryFilter || statusFilter || searchQuery) && (
              <div className="mt-4 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Active filters:</span>
                {categoryFilter && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setCategoryFilter('')}>
                    {categoryFilter} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {statusFilter && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setStatusFilter('')}>
                    {statusFilter} <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchQuery('')}>
                    "{searchQuery}" <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : feedback.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No feedback found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {feedback.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedFeedback(item)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                        <Badge variant={getCategoryColor(item.category)}>{item.category}</Badge>
                        <Badge variant={getSentimentColor(item.ai_sentiment)}>{item.ai_sentiment}</Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.ai_summary}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(item.createdAt)}
                        </span>
                        <span className={`flex items-center gap-1 font-medium ${getPriorityColor(item.ai_priority)}`}>
                          <TrendingUp className="w-4 h-4" />
                          Priority: {item.ai_priority}/10
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.ai_tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Select
                        value={item.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(item.id, e.target.value as FeedbackStatus);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-36"
                      >
                        <option value="New">New</option>
                        <option value="In Review">In Review</option>
                        <option value="Resolved">Resolved</option>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedFeedback.title}</DialogTitle>
                <DialogDescription>
                  Submitted {formatDate(selectedFeedback.createdAt)}
                  {selectedFeedback.submitterName && ` by ${selectedFeedback.submitterName}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Full Description</h4>
                  <p className="text-gray-600">{selectedFeedback.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">AI Summary</h4>
                  <p className="text-gray-600">{selectedFeedback.ai_summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                    <Badge variant={getCategoryColor(selectedFeedback.category)}>
                      {selectedFeedback.category}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sentiment</h4>
                    <Badge variant={getSentimentColor(selectedFeedback.ai_sentiment)}>
                      {selectedFeedback.ai_sentiment}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Priority Score</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600"
                        style={{ width: `${(selectedFeedback.ai_priority / 10) * 100}%` }}
                      />
                    </div>
                    <span className={`font-medium ${getPriorityColor(selectedFeedback.ai_priority)}`}>
                      {selectedFeedback.ai_priority}/10
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">AI Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeedback.ai_tags.map((tag, index) => (
                      <Badge key={index} variant="default">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Status</h4>
                  <Select
                    value={selectedFeedback.status}
                    onChange={(e) => handleStatusChange(selectedFeedback.id, e.target.value as FeedbackStatus)}
                    className="w-full"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </Select>
                </div>

                {selectedFeedback.submitterEmail && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Contact</h4>
                    <p className="text-gray-600">{selectedFeedback.submitterEmail}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
