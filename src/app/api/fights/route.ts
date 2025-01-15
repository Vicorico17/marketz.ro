import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'

export async function GET() {
  console.log('GET /api/fights - Starting...');
  try {
    console.log('Connecting to MongoDB...');
    const conn = await connectDB();
    console.log('Connected to MongoDB, connection state:', conn.connection.readyState);
    
    // First check what's in the database
    const allFights = await Fight.find({});
    console.log('Raw database content:', JSON.stringify(allFights, null, 2));
    
    // Then get the sorted fights
    const fights = await Fight.find({}).sort({ date: -1 });
    console.log(`Found ${fights.length} fights after sorting:`, JSON.stringify(fights, null, 2));
    
    return NextResponse.json(fights)
  } catch (error) {
    console.error('Failed to fetch fights:', error);
    return NextResponse.json({ error: 'Failed to fetch fights' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log('POST /api/fights - Starting...');
  try {
    console.log('Connecting to MongoDB...');
    const conn = await connectDB();
    console.log('Connected to MongoDB, connection state:', conn.connection.readyState);
    
    const body = await request.json();
    console.log('Received fight data:', JSON.stringify(body, null, 2));
    
    // Ensure date is a proper Date object
    const fightData = {
      ...body,
      date: new Date(body.date),
      predictions: new Map()
    };
    console.log('Processed fight data:', JSON.stringify(fightData, null, 2));
    
    try {
      // First check if MongoDB is connected
      if (conn.connection.readyState !== 1) {
        throw new Error('MongoDB not connected. Current state: ' + conn.connection.readyState);
      }

      // List available collections
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map((c: { name: string }) => c.name));

      // Create the fight
      console.log('Creating fight in database...');
      const newFight = await Fight.create(fightData);
      console.log('Fight created in database:', JSON.stringify(newFight.toJSON(), null, 2));
      
      // Verify the fight was saved
      console.log('Verifying fight was saved...');
      const savedFight = await Fight.findById(newFight._id);
      if (savedFight) {
        console.log('Verified saved fight:', JSON.stringify(savedFight.toJSON(), null, 2));
      } else {
        console.error('Fight was not found after creation!');
        throw new Error('Fight was not found after creation');
      }
      
      return NextResponse.json(newFight.toJSON(), { status: 201 })
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to create fight:', error);
    return NextResponse.json({ 
      error: 'Failed to create fight',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

