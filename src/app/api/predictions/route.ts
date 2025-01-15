import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'

export async function POST(request: Request) {
  try {
    await connectDB();
    const { fightId, winner } = await request.json()
    
    const fight = await Fight.findById(fightId);
    if (!fight) {
      return NextResponse.json({ error: 'Fight not found' }, { status: 404 })
    }

    // Get current predictions or initialize new map
    const currentPredictions = fight.predictions?.toObject() || {};
    const predictions = new Map<string, number>();
    
    // Convert existing predictions to Map
    Object.entries(currentPredictions).forEach(([key, value]) => {
      predictions.set(key, Number(value));
    });
    
    // Update prediction counts
    predictions.set(winner, (predictions.get(winner) || 0) + 1);
    
    // Save updated predictions
    fight.predictions = predictions;
    await fight.save();

    // Convert Map to object for response
    const percentages: { [key: string]: number } = {};
    let total = 0;
    
    predictions.forEach((count: number) => {
      total += count;
    });
    
    predictions.forEach((count: number, fighter: string) => {
      percentages[fighter] = Math.round((count / total) * 100);
    });

    return NextResponse.json(percentages)
  } catch (error) {
    console.error('Failed to submit prediction:', error);
    return NextResponse.json({ error: 'Failed to submit prediction' }, { status: 500 })
  }
}

