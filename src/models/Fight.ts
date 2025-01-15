import mongoose from 'mongoose';

export interface IFight extends mongoose.Document {
  fighter1: string;
  fighter2: string;
  fighter1Image?: string;
  fighter2Image?: string;
  date: Date;
  category: string;
  predictions: Map<string, number>;
}

const FightSchema = new mongoose.Schema<IFight>({
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
    default: () => new Map()
  }
}, {
  timestamps: true,
  collection: 'fights',
  strict: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      // Convert Map to Object for JSON
      if (ret.predictions instanceof Map) {
        const predictionsObj: { [key: string]: number } = {};
        ret.predictions.forEach((value, key) => {
          predictionsObj[key] = value;
        });
        ret.predictions = predictionsObj;
      }
      return ret;
    }
  }
});

// Add middleware to log operations
FightSchema.pre('save', function(next) {
  console.log('Saving fight:', this.toObject());
  next();
});

FightSchema.post('save', function(doc) {
  console.log('Fight saved:', doc.toObject());
});

// Delete the model if it exists to prevent OverwriteModelError
if (mongoose.models.Fight) {
  delete mongoose.models.Fight;
}

export default mongoose.model<IFight>('Fight', FightSchema); 