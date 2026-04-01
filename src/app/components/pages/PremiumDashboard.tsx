import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Skeleton, FeedbackCardSkeleton, StatCardSkeleton } from '../ui/Skeleton';
import { Sidebar } from '../Sidebar';
import { Feedback, FeedbackCategory, FeedbackStatus, Sentiment } from '../../types';
import { apiService } from '../../services/api.service';
import { formatDate } from '../../lib/utils';
import {
  MessageSquare,
  LogOut,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Tag,
  X,
  User,
  ChevronDown,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PremiumDashboardProps {
  onLogout: () => void;
}

export function PremiumDashboard({ onLogout }: PremiumDashboardProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'feedback' | 'analytics'>('dashboard');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<FeedbackCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'ai_priority' | 'ai_sentiment'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [weeklySummary, setWeeklySummary] = useState<{ total: number; topCategory: string; topTags: string[]; summary: string } | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [reanalyzingId, setReanalyzingId] = useState<string | null>(null);
  const user = apiService.getUser();

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, statusFilter, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    loadFeedback();
  }, [categoryFilter, statusFilter, searchQuery, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadWeeklySummary();
    }
  }, [activeTab]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const { items, total } = await apiService.getFeedback({
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
        search: searchQuery || undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 10,
      });
      setFeedback(items);
      setTotalItems(total);
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

      if (selectedFeedback && selectedFeedback.id === id) {
        const updated = await apiService.getFeedbackById(id);
        setSelectedFeedback(updated);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const loadWeeklySummary = async () => {
    setSummaryLoading(true);

    try {
      const summary = await apiService.getWeeklySummary();
      setWeeklySummary(summary);
    } catch (error) {
      toast.error('Failed to load weekly summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleReanalyze = async (id: string) => {
    setReanalyzingId(id);

    try {
      const updated = await apiService.reanalyzeFeedback(id);
      toast.success('AI analysis refreshed');
      loadFeedback();

      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(updated);
      }
    } catch (error) {
      toast.error('Failed to refresh AI analysis');
    } finally {
      setReanalyzingId(null);
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

  // Chart data
  const trendData = feedback
    .reduce((acc, f) => {
      const date = new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }
      return acc;
    }, [] as { date: string; count: number }[])
    .slice(-7);

  const categoryData = [
    { name: 'Bug', value: feedback.filter(f => f.category === 'Bug').length, color: '#ef4444' },
    { name: 'Feature', value: feedback.filter(f => f.category === 'Feature Request').length, color: '#10b981' },
    { name: 'Improvement', value: feedback.filter(f => f.category === 'Improvement').length, color: '#6366f1' },
    { name: 'Other', value: feedback.filter(f => f.category === 'Other').length, color: '#8b5cf6' }
  ].filter(item => item.value > 0);

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
    if (priority >= 8) return 'text-red-600 dark:text-red-400';
    if (priority >= 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginationLabel = `${totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`;

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="lg:pl-64 transition-all duration-300">
        {/* Top Navbar */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800"
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'feedback' && 'Feedback Management'}
                  {activeTab === 'analytics' && 'Analytics'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activeTab === 'dashboard' && 'Overview of all feedback'}
                  {activeTab === 'feedback' && 'Manage and respond to feedback'}
                  {activeTab === 'analytics' && 'Insights and trends'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.email || 'admin@feedpulse.com'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={onLogout}
                  size="sm"
                  className="border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.nav>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Feedback</p>
                    <MessageSquare className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Items</p>
                    <Clock className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Priority</p>
                    <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgPriority}</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Tag</p>
                    <Tag className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white truncate">{stats.mostCommonTag}</p>
                  <div className="mt-2 h-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full" />
                </motion.div>
              </>
            )}
          </div>

          {/* Charts - Show only on dashboard and analytics tabs */}
          {(activeTab === 'dashboard' || activeTab === 'analytics') && !loading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeTab === 'dashboard' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly AI Summary</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Top feedback themes from the last 7 days.</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadWeeklySummary}
                      disabled={summaryLoading}
                    >
                      {summaryLoading ? 'Refreshing...' : 'Refresh'}
                    </Button>
                  </div>

                  {weeklySummary ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-200">{weeklySummary.summary}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total submissions</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{weeklySummary.total}</p>
                        </div>
                        <div className="rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Top category</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{weeklySummary.topCategory}</p>
                        </div>
                        <div className="rounded-2xl bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-800">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Top themes</p>
                          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{weeklySummary.topTags.join(', ') || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">No weekly summary available yet. Click refresh to generate it.</p>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feedback Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="url(#colorGradient)"
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-6">
                  <PieChartIcon className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* Filters - Show only on feedback tab */}
          {activeTab === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search feedback..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                  />
                </div>

                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as FeedbackCategory | '')}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700"
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
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                </Select>

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'ai_priority' | 'ai_sentiment')}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                  >
                    <option value="createdAt">Sort by date</option>
                    <option value="ai_priority">Sort by priority</option>
                    <option value="ai_sentiment">Sort by sentiment</option>
                  </Select>
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </Select>
                </div>
              </div>

              {(categoryFilter || statusFilter || searchQuery) && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                  <AnimatePresence>
                    {categoryFilter && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setCategoryFilter('')}
                        >
                          {categoryFilter} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      </motion.div>
                    )}
                    {statusFilter && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setStatusFilter('')}
                        >
                          {statusFilter} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      </motion.div>
                    )}
                    {searchQuery && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setSearchQuery('')}
                        >
                          "{searchQuery}" <X className="w-3 h-3 ml-1" />
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {totalItems > pageSize && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-4 shadow-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Showing {paginationLabel}</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === pageCount}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Feedback List */}
          <div className="space-y-4">
            {loading ? (
              <>
                <FeedbackCardSkeleton />
                <FeedbackCardSkeleton />
                <FeedbackCardSkeleton />
              </>
            ) : feedback.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-12 text-center shadow-lg"
              >
                <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No feedback found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                  {categoryFilter || statusFilter || searchQuery
                    ? 'Try adjusting your filters'
                    : 'Feedback will appear here once submitted'}
                </p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {feedback.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedFeedback(item)}
                    className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {item.title}
                          </h3>
                          <Badge variant={getCategoryColor(item.category)}>{item.category}</Badge>
                          <Badge variant={getSentimentColor(item.ai_sentiment)}>{item.ai_sentiment}</Badge>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {item.ai_summary}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(item.createdAt)}
                          </span>
                          <span className={`flex items-center gap-1 font-medium ${getPriorityColor(item.ai_priority)}`}>
                            <TrendingUp className="w-4 h-4" />
                            Priority: {item.ai_priority}/10
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {item.ai_tags.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
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
                          className="w-36 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                        >
                          <option value="New">New</option>
                          <option value="In Review">In Review</option>
                          <option value="Resolved">Resolved</option>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-white/20 dark:border-gray-800/50">
          {selectedFeedback && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedFeedback.title}</DialogTitle>
                <DialogDescription className="text-base">
                  Submitted {formatDate(selectedFeedback.createdAt)}
                  {selectedFeedback.submitterName && ` by ${selectedFeedback.submitterName}`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Full Description</h4>
                  <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                    {selectedFeedback.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">AI Summary</h4>
                  <p className="text-gray-600 dark:text-gray-300 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-4">
                    {selectedFeedback.ai_summary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Category</h4>
                    <Badge variant={getCategoryColor(selectedFeedback.category)} className="text-base px-4 py-1">
                      {selectedFeedback.category}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Sentiment</h4>
                    <Badge variant={getSentimentColor(selectedFeedback.ai_sentiment)} className="text-base px-4 py-1">
                      {selectedFeedback.ai_sentiment}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Priority Score</h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedFeedback.ai_priority / 10) * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
                      />
                    </div>
                    <span className={`font-bold text-lg ${getPriorityColor(selectedFeedback.ai_priority)}`}>
                      {selectedFeedback.ai_priority}/10
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">AI Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFeedback.ai_tags.map((tag, index) => (
                      <Badge key={index} variant="default" className="text-sm px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Status</h4>
                  <Select
                    value={selectedFeedback.status}
                    onChange={(e) => handleStatusChange(selectedFeedback.id, e.target.value as FeedbackStatus)}
                    className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </Select>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">AI Analysis</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleReanalyze(selectedFeedback.id)}
                    disabled={reanalyzingId === selectedFeedback.id}
                  >
                    {reanalyzingId === selectedFeedback.id ? 'Re-analyzing...' : 'Re-run AI'}
                  </Button>
                </div>

                {selectedFeedback.submitterEmail && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Contact</h4>
                    <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
                      {selectedFeedback.submitterEmail}
                    </p>
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
