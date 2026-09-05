import mongoose, { Schema, Document } from 'mongoose';

export interface IClimateSnapshot extends Document {
  location: {
    city: string;
    country: string;
    lat: number;
    lon: number;
  };
  source: string; // e.g. "NASA_POWER", "NASA_EONET", "OPEN_CO2", "MOCK_PROVIDER"
  aqi?: number;
  temperatureC?: number;
  precipitationMm?: number;
  humidityPct?: number;
  solarRadiation?: number;
  co2ppm?: number;
  naturalEvents?: Array<{
    id: string;
    title: string;
    category: string;
    date: Date;
  }>;
  extra?: Record<string, any>;
  recordedAt: Date;
}

const ClimateSnapshotSchema: Schema = new Schema(
  {
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    source: { type: String, required: true },
    aqi: { type: Number },
    temperatureC: { type: Number },
    precipitationMm: { type: Number },
    humidityPct: { type: Number },
    solarRadiation: { type: Number },
    co2ppm: { type: Number },
    naturalEvents: [
      {
        id: { type: String },
        title: { type: String },
        category: { type: String },
        date: { type: Date },
      },
    ],
    extra: { type: Schema.Types.Mixed, default: {} },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ClimateSnapshotSchema.index({ 'location.city': 1, recordedAt: -1 });

export const ClimateSnapshot = mongoose.model<IClimateSnapshot>('ClimateSnapshot', ClimateSnapshotSchema);
