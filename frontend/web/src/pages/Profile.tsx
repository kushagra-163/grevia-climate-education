import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../api/userApi';
import { quizApi } from '../api/quizApi';
import { Card } from '../components/ui/Card';
import { BadgeCard } from '../components/cards/BadgeCard';
import { AnalyticsChart } from '../components/charts/AnalyticsChart';
import { User, Award, MapPin, Globe, Sparkles } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      const [pRes, bRes, sRes] = await Promise.all([
        userApi.getUserProfile(user!.id),
        userApi.getBadges(user!.id),
        quizApi.getSkills(user!.id),
      ]);
      setProfile(pRes.profile);
      setBadges(bRes.badges || []);
      setSkills(sRes.skillProfiles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = skills.map((s) => ({
    name: s.domain.replace(/_/g, ' '),
    score: s.score,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <Card className="p-8 bg-earth-surface border-earth-border flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="w-20 h-20 rounded-3xl bg-earth-primary-soft p-1 border border-earth-primary/30 shrink-0">
          <div className="w-full h-full bg-earth-secondary rounded-[22px] flex items-center justify-center text-earth-primary-light">
            <User className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl font-black text-earth-text">{user?.name}</h1>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="px-3 py-1 rounded-full bg-earth-primary-soft border border-earth-primary/30 text-earth-primary-light text-xs font-bold capitalize">
                {user?.role}
              </span>
              <span className="px-3 py-1 rounded-full bg-earth-amber-soft border border-earth-amber/30 text-earth-amber text-xs font-bold">
                {user?.points || 0} Pts
              </span>
            </div>
          </div>

          <p className="text-xs text-earth-muted">{user?.email}</p>

          <div className="flex items-center justify-center sm:justify-start space-x-4 text-xs text-earth-muted pt-2">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-earth-primary-light" />
              <span>{user?.city || 'Earth'}, {user?.country || 'Global'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-earth-accent" />
              <span>Language: {user?.language?.toUpperCase() || 'EN'}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Skill Profile Breakdown */}
      <Card className="space-y-4">
        <div className="flex items-center space-x-2 text-earth-primary-light font-bold text-base">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-earth-text">Adaptive Skill Domain Profile</h3>
        </div>
        {chartData.length > 0 ? (
          <AnalyticsChart data={chartData} />
        ) : (
          <div className="p-8 text-center text-xs text-earth-subtle">
            Complete adaptive quizzes to generate domain skill profile scores.
          </div>
        )}
      </Card>

      {/* Earned Badges Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-earth-text flex items-center space-x-2">
          <Award className="w-5 h-5 text-earth-amber" />
          <span>Earned Badges & Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b) => (
            <BadgeCard key={b._id} badge={b.badgeId || b} isUnlocked={true} />
          ))}
          {badges.length === 0 && (
            <div className="col-span-full p-8 text-center glass-card rounded-2xl text-xs text-earth-muted">
              No badges earned yet. Take your first quiz or log an eco-action to unlock badges!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
