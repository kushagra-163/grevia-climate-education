import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BrainCircuit, Trophy, Sparkles, ArrowRight, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-earth-primary-soft border border-earth-primary/30 text-earth-primary-light text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation AI Climate Learning</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-earth-text tracking-tight leading-tight">
          Learn Climate.{' '}
          <span className="text-earth-primary-light">
            Take Action.
          </span>{' '}
          Make an Impact.
        </h1>

        <p className="text-lg text-earth-muted max-w-2xl mx-auto leading-relaxed">
          Grevia is the production-grade climate education platform powered by real NASA environmental data, adaptive quiz engines, and an AI Eco-Coach.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto space-x-2">
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/eco-coach">
            <Button size="lg" variant="outline" className="w-full sm:w-auto space-x-2">
              <Leaf className="w-5 h-5" />
              <span>Talk to Eco-Coach AI</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-3xl border border-earth-border hover:border-earth-primary/40 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center text-earth-primary-light">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-earth-text">Adaptive Quiz Engine</h3>
          <p className="text-sm text-earth-muted leading-relaxed">
            Quizzes dynamically adapt to your performance. Fast high scores increase challenge levels; lower scores introduce targeted revision.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-earth-border hover:border-earth-primary/40 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center text-earth-primary-light">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-earth-text">AI Eco-Coach</h3>
          <p className="text-sm text-earth-muted leading-relaxed">
            Get personalized answers, instant quiz explanations, and daily habit suggestions powered by tailored climate AI prompts.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-earth-border hover:border-earth-accent/40 transition-all space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-earth-accent-soft border border-earth-accent/30 flex items-center justify-center text-earth-accent">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-earth-text">NASA Data Pipeline</h3>
          <p className="text-sm text-earth-muted leading-relaxed">
            Connect directly with live NASA EONET natural events, NASA POWER daily weather metrics, and global CO₂ concentrations.
          </p>
        </div>
      </section>

      {/* Gamification Callout */}
      <section className="glass-panel p-10 rounded-3xl border border-earth-border flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-earth-amber uppercase tracking-widest">
            <Trophy className="w-4 h-4" />
            <span>Gamified Sustainability</span>
          </div>
          <h2 className="text-3xl font-extrabold text-earth-text">Log Eco-Actions & Earn Real Badges</h2>
          <p className="text-earth-muted text-sm leading-relaxed">
            Every sustainable choice — using public transport, saving energy, or planting trees — creates verified ledger entries, awards points, unlocks badges, and ranks you on global leaderboards.
          </p>
        </div>
        <Link to="/register">
          <Button size="lg" className="bg-earth-amber hover:bg-amber-600 text-white font-bold whitespace-nowrap shadow-md">
            Join the Challenge
          </Button>
        </Link>
      </section>
    </div>
  );
};
