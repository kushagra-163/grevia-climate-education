import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CloudSun, Flame, Thermometer, Wind } from 'lucide-react';

interface ClimateInsightProps {
  climate: {
    location: { city: string; country: string };
    source?: string;
    temperatureC?: number;
    co2ppm?: number;
    aqi?: number;
    naturalEvents?: Array<{ title: string; category: string }>;
  } | null;
}

export const ClimateInsightCard: React.FC<ClimateInsightProps> = ({ climate }) => {
  if (!climate) {
    return (
      <Card className="animate-pulse flex items-center justify-between">
        <div className="h-20 bg-earth-secondary rounded-xl w-full" />
      </Card>
    );
  }

  const isLive = climate.source === 'NASA_POWER' || climate.source === 'NASA_EONET';
  const feedTitle = isLive ? 'Live NASA Climate Feed' : 'NASA Climate Feed — Demo Data';

  return (
    <Card hoverEffect className="bg-earth-surface border-earth-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CloudSun className="w-5 h-5 text-earth-primary-light" />
          <h3 className="font-bold text-earth-text text-base">{feedTitle}</h3>
        </div>
        <Badge variant="emerald">{climate.location.city}, {climate.location.country}</Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 my-4 text-center">
        <div className="bg-earth-secondary p-3 rounded-xl border border-earth-border">
          <div className="flex items-center justify-center text-earth-amber mb-1">
            <Thermometer className="w-4 h-4" />
          </div>
          <span className="text-xs text-earth-muted block font-medium">Temperature</span>
          <span className="text-lg font-bold text-earth-text">{climate.temperatureC ?? 18}°C</span>
        </div>

        <div className="bg-earth-secondary p-3 rounded-xl border border-earth-border">
          <div className="flex items-center justify-center text-earth-accent mb-1">
            <Wind className="w-4 h-4" />
          </div>
          <span className="text-xs text-earth-muted block font-medium">Atmospheric CO₂</span>
          <span className="text-lg font-bold text-earth-text">{climate.co2ppm ?? 421} ppm</span>
        </div>

        <div className="bg-earth-secondary p-3 rounded-xl border border-earth-border">
          <div className="flex items-center justify-center text-earth-primary-light mb-1">
            <CloudSun className="w-4 h-4" />
          </div>
          <span className="text-xs text-earth-muted block font-medium">Air Quality</span>
          <span className="text-lg font-bold text-earth-text">{climate.aqi ?? 32} AQI</span>
        </div>
      </div>

      {climate.naturalEvents && climate.naturalEvents.length > 0 && (
        <div className="mt-3 pt-3 border-t border-earth-border flex items-center space-x-2 text-xs text-earth-muted">
          <Flame className="w-4 h-4 text-rose-500 shrink-0" />
          <span className="truncate font-medium">{climate.naturalEvents[0].title}</span>
        </div>
      )}
    </Card>
  );
};
