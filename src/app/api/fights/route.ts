import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'
import { Fight as FightType } from '@/types/fight'

export async function GET() {
  console.log('GET /api/fights - Starting...');
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB, fetching fights...');
    
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
    await connectDB();
    
    const body = await request.json();
    console.log('Creating new fight with data:', JSON.stringify(body, null, 2));
    
    const newFight = await Fight.create({ 
      ...body,
      predictions: new Map()
    });
    
    console.log('Fight created successfully:', JSON.stringify(newFight, null, 2));
    return NextResponse.json(newFight, { status: 201 })
  } catch (error) {
    console.error('Failed to create fight:', error);
    return NextResponse.json({ 
      error: 'Failed to create fight',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

