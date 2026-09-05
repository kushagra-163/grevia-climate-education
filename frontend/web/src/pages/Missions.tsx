import React, { useEffect, useState } from 'react';
import { gamificationApi } from '../api/gamificationApi';
import { MissionCard } from '../components/cards/MissionCard';
import { Target } from 'lucide-react';

export const Missions: React.FC = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [userMissions, setUserMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [mRes, umRes] = await Promise.all([
        gamificationApi.getMissions(),
        gamificationApi.getUserMissions().catch(() => ({ userMissions: [] })),
      ]);
      setMissions(mRes.missions || []);
      setUserMissions(umRes.userMissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (missionId: string) => {
    try {
      await gamificationApi.joinMission(missionId);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to join mission');
    }
  };

  const userMissionMap = new Map(userMissions.map((um) => [um.missionId?._id || um.missionId, um]));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-earth-primary-soft border border-earth-primary/30 flex items-center justify-center text-earth-primary-light">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-earth-text">Climate Action Missions</h1>
          <p className="text-xs text-earth-muted">Take on real-world challenges, complete milestones, and earn points!</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-earth-secondary rounded-2xl border border-earth-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((m) => {
            const userMission = userMissionMap.get(m._id);
            return (
              <MissionCard
                key={m._id}
                mission={m}
                isJoined={!!userMission}
                progress={userMission?.progress || 0}
                isCompleted={userMission?.completed || false}
                onJoin={handleJoin}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
