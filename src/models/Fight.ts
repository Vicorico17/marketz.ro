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
    type: String,
    required: false,
  },
  fighter2Image: {
    type: String,
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
    default: () => new Map(),
  },
}, {
  timestamps: true,
  collection: 'fights',
  strict: true
});

// Add middleware to log operations
FightSchema.pre('save', function(next) {
  console.log('Saving fight:', this.toObject());
  next();
});

FightSchema.post('save', function(doc) {
  console.log('Fight saved:', doc.toObject());
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

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Fight) {
  delete mongoose.models.Fight;
}

export default mongoose.model('Fight', FightSchema); 