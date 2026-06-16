import { Schema, model, models } from 'mongoose';

const SocialLinkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'link',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to speed up ordered links by user queries
SocialLinkSchema.index({ userId: 1, order: 1 });

export const SocialLink = models.SocialLink || model('SocialLink', SocialLinkSchema);
