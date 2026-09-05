import React, { useEffect, useState } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Shield, Users, BrainCircuit, Sparkles, PlusCircle } from 'lucide-react';
import { apiClient } from '../api/apiClient';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lesson creation form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    topic: 'climate_science',
    level: 'beginner',
    summary: '',
    content: '',
    estimatedMinutes: 10,
  });

  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    analyticsApi.getCommunityAnalytics().then((res) => {
      setAnalytics(res.analytics);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg('');
    try {
      await apiClient.post('/lessons', lessonForm);
      setFormMsg('Lesson created successfully!');
      setLessonForm({
        title: '',
        topic: 'climate_science',
        level: 'beginner',
        summary: '',
        content: '',
        estimatedMinutes: 10,
      });
    } catch (err: any) {
      setFormMsg(err.response?.data?.error?.message || 'Failed to create lesson.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-earth-accent-soft border border-earth-accent/30 flex items-center justify-center text-earth-accent">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-earth-text">Administrator Analytics & Management</h1>
          <p className="text-xs text-earth-muted">Monitor system engagement metrics and publish climate learning modules.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Platform Users" value={`${analytics?.totalUsers || 0}`} icon={Users} color="cyan" />
        <StatCard title="Completed Quizzes" value={`${analytics?.totalQuizzesCompleted || 0}`} icon={BrainCircuit} color="emerald" />
        <StatCard title="Logged Eco-Actions" value={`${analytics?.totalEcoActionsLogged || 0}`} icon={Sparkles} color="amber" />
        <StatCard title="Cumulative CO₂ Saved" value={`${analytics?.totalCo2SavedKg || 0} kg`} icon={Sparkles} color="teal" />
      </div>

      {/* Lesson Creation Panel */}
      <Card className="space-y-6">
        <div className="flex items-center space-x-2 text-earth-text font-bold text-lg">
          <PlusCircle className="w-5 h-5 text-earth-primary-light" />
          <h2>Publish New Climate Lesson</h2>
        </div>

        {formMsg && (
          <div className="p-3 rounded-xl bg-earth-primary-soft border border-earth-primary/30 text-xs text-earth-primary-light font-medium">
            {formMsg}
          </div>
        )}

        <form onSubmit={handleCreateLesson} className="space-y-4">
          <Input
            label="Lesson Title"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            placeholder="Understanding Ocean Acidification"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-earth-muted uppercase tracking-wider mb-1.5">
                Topic
              </label>
              <select
                value={lessonForm.topic}
                onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                className="w-full px-4 py-2.5 bg-earth-surface border border-earth-border rounded-xl text-earth-text text-sm focus:outline-none focus:border-earth-primary"
              >
                <option value="climate_science">Climate Science</option>
                <option value="energy">Energy</option>
                <option value="renewable_energy">Renewable Energy</option>
                <option value="waste">Waste</option>
                <option value="water">Water</option>
                <option value="biodiversity">Biodiversity</option>
                <option value="transportation">Transportation</option>
                <option value="sustainable_living">Sustainable Living</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-earth-muted uppercase tracking-wider mb-1.5">
                Level
              </label>
              <select
                value={lessonForm.level}
                onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                className="w-full px-4 py-2.5 bg-earth-surface border border-earth-border rounded-xl text-earth-text text-sm focus:outline-none focus:border-earth-primary"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <Input
              label="Est. Minutes"
              type="number"
              value={lessonForm.estimatedMinutes}
              onChange={(e) => setLessonForm({ ...lessonForm, estimatedMinutes: parseInt(e.target.value, 10) || 10 })}
            />
          </div>

          <Input
            label="Lesson Summary"
            value={lessonForm.summary}
            onChange={(e) => setLessonForm({ ...lessonForm, summary: e.target.value })}
            placeholder="Short 1-sentence description..."
            required
          />

          <div>
            <label className="block text-xs font-semibold text-earth-muted uppercase tracking-wider mb-1.5">
              Full Lesson Content (Markdown Supported)
            </label>
            <textarea
              rows={4}
              value={lessonForm.content}
              onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
              className="w-full px-4 py-2.5 bg-earth-surface border border-earth-border rounded-xl text-earth-text text-sm focus:outline-none focus:border-earth-primary placeholder:text-earth-subtle"
              placeholder="Full text of the lesson content..."
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Publish Lesson
          </Button>
        </form>
      </Card>
    </div>
  );
};
