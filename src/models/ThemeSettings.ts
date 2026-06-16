import { Schema, model, models } from 'mongoose';

const ThemeSettingsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    primaryColor: {
      type: String,
      default: '#00F5FF', // Neon Cyan
    },
    accentColor: {
      type: String,
      default: '#7A5CFF', // Electric Purple
    },
    showMoon: {
      type: Boolean,
      default: true,
    },
    showStars: {
      type: Boolean,
      default: true,
    },
    showEnergyWaves: {
      type: Boolean,
      default: true,
    },
    musicEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ThemeSettings = models.ThemeSettings || model('ThemeSettings', ThemeSettingsSchema);
