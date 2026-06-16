import { Schema, model, models } from 'mongoose';

const AnalyticsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['page_view', 'link_click'],
    required: true,
  },
  linkId: {
    type: Schema.Types.ObjectId,
    ref: 'SocialLink',
    required: false,
  },
  userAgent: {
    type: String,
    default: '',
  },
  referrer: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

AnalyticsSchema.index({ userId: 1, timestamp: -1 });
AnalyticsSchema.index({ type: 1 });

export const Analytics = models.Analytics || model('Analytics', AnalyticsSchema);
