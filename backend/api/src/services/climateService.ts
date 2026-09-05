import { ClimateSnapshot } from '../models/ClimateSnapshot';

const CITY_COUNTRY_MAP: Record<string, { country: string; lat: number; lon: number }> = {
  nashik: { country: 'India', lat: 19.9975, lon: 73.7898 },
  mumbai: { country: 'India', lat: 19.076, lon: 72.8777 },
  delhi: { country: 'India', lat: 28.6139, lon: 77.209 },
  berlin: { country: 'Germany', lat: 52.52, lon: 13.405 },
  tokyo: { country: 'Japan', lat: 35.676, lon: 139.65 },
  'new york': { country: 'USA', lat: 40.7128, lon: -74.006 },
  nairobi: { country: 'Kenya', lat: -1.2921, lon: 36.8219 },
  sydney: { country: 'Australia', lat: -33.8688, lon: 151.2093 },
  london: { country: 'UK', lat: 51.5074, lon: -0.1278 },
  paris: { country: 'France', lat: 48.8566, lon: 2.3522 },
};

export class ClimateService {
  static async getCurrentClimate(city = 'Berlin', requestedCountry?: string) {
    const cityKey = city.trim().toLowerCase();
    const mapped = CITY_COUNTRY_MAP[cityKey];

    const resolvedCountry = requestedCountry || mapped?.country || (cityKey === 'berlin' ? 'Germany' : 'Global');
    const lat = mapped?.lat || 20.0;
    const lon = mapped?.lon || 70.0;

    let snapshot = await ClimateSnapshot.findOne({ 'location.city': new RegExp(`^${city}$`, 'i') })
      .sort({ recordedAt: -1 });

    if (!snapshot) {
      // Fallback snapshot with correct location and country
      const eventTitle = resolvedCountry === 'India'
        ? 'South Asian Climate Monitoring Advisory'
        : resolvedCountry === 'Germany'
        ? 'European Warm Wave Alert'
        : 'Global Atmospheric Activity Event';

      snapshot = new ClimateSnapshot({
        location: { city, country: resolvedCountry, lat, lon },
        source: 'NASA_POWER_MOCK',
        temperatureC: resolvedCountry === 'India' ? 27.5 : 18.5,
        precipitationMm: 0.2,
        humidityPct: 62,
        solarRadiation: 4.8,
        co2ppm: 421.3,
        aqi: resolvedCountry === 'India' ? 45 : 32,
        recordedAt: new Date(),
        naturalEvents: [
          { id: 'EONET-1', title: eventTitle, category: 'Atmosphere', date: new Date() },
        ],
      });
    }

    return snapshot;
  }

  static async getClimateTrends(city = 'Berlin', days = 7, requestedCountry?: string) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const snapshots = await ClimateSnapshot.find({
      'location.city': new RegExp(`^${city}$`, 'i'),
      recordedAt: { $gte: startDate },
    }).sort({ recordedAt: 1 });

    if (snapshots.length > 0) {
      return snapshots;
    }

    // Generate mock trend data for requested days
    const mockTrends = [];
    for (let i = days; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      mockTrends.push({
        date: d.toISOString().split('T')[0],
        temperatureC: 18 + Math.sin(i) * 3 + Math.random() * 2,
        co2ppm: 420 + Math.random() * 2,
        precipitationMm: Math.max(0, Math.sin(i * 2) * 4),
      });
    }
    return mockTrends;
  }
}
