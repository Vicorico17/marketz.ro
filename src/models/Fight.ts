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
});

export default mongoose.models.Fight || mongoose.model('Fight', FightSchema); 