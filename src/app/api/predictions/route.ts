import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'
import mongoose from 'mongoose'

interface FightDocument extends mongoose.Document {
  predictions: Map<string, number>;
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { fightId, winner } = await request.json();
    
    // Find the fight
    const fight = await Fight.findById(fightId) as FightDocument;
    if (!fight) {
      return NextResponse.json({ error: 'Fight not found' }, { status: 404 });
    }

    // Initialize predictions if not exists
    if (!fight.predictions) {
      fight.predictions = new Map<string, number>();
    }
    
    // Update predictions
    const currentCount = fight.predictions.get(winner) || 0;
    fight.predictions.set(winner, currentCount + 1);
    
    // Save updated fight
    await fight.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update predictions:', error);
    return NextResponse.json({ 
      error: 'Failed to update predictions',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

