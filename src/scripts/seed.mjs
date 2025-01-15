import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://vicorico:a57BAZHLFuqQ4c0x@cluster1.xa6kx.mongodb.net/marketz?retryWrites=true&w=majority&appName=Cluster1';

const initialFights = [
  {
    fighter1: 'John Doe',
    fighter2: 'Jane Smith',
    date: new Date('2024-02-01'),
    category: 'Lightweight',
    predictions: new Map([
      ['John Doe', 3],
      ['Jane Smith', 2]
    ])
  },
  {
    fighter1: 'Mike Johnson',
    fighter2: 'Sarah Williams',
    date: new Date('2024-02-15'),
    category: 'Middleweight',
    predictions: new Map([
      ['Mike Johnson', 5],
      ['Sarah Williams', 4]
    ])
  },
  {
    fighter1: 'Alex Brown',
    fighter2: 'Chris Davis',
    date: new Date('2024-03-01'),
    category: 'Heavyweight',
    predictions: new Map([
      ['Alex Brown', 7],
      ['Chris Davis', 6]
    ])
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully');

    // Import the Fight model
    const FightSchema = new mongoose.Schema({
      fighter1: String,
      fighter2: String,
      date: Date,
      category: String,
      predictions: {
        type: Map,
        of: Number
      }
    }, { collection: 'fights' });

    const Fight = mongoose.models.Fight || mongoose.model('Fight', FightSchema);

    // Clear existing fights
    console.log('Clearing existing fights...');
    await Fight.deleteMany({});

    // Insert new fights
    console.log('Inserting new fights...');
    const result = await Fight.insertMany(initialFights);
    console.log(`Successfully inserted ${result.length} fights`);

    // Verify the insertion
    const fights = await Fight.find({});
    console.log('Current fights in database:', JSON.stringify(fights, null, 2));

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seed function
seed(); 