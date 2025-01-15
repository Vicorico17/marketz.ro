import mongoose from 'mongoose';

const FightSchema = new mongoose.Schema({
  fighter1: {
    type: String,
    required: true,
  },
  fighter2: {
    type: String,
    required: true,
  },
  fighter1Image: {
    type: String,  // This will store the Cloudinary URL
    required: false,
  },
  fighter2Image: {
    type: String,  // This will store the Cloudinary URL
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  predictions: {
    type: Map,
    of: Number,
    default: new Map(),
  },
}, {
  timestamps: true,
  collection: 'fights'
});

FightSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.predictions instanceof Map) {
      ret.predictions = Object.fromEntries(ret.predictions);
    }
    return ret;
  }
});

export default mongoose.models.Fight || mongoose.model('Fight', FightSchema); 