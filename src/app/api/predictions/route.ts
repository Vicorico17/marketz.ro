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
    const predictions = fight.predictions || new Map<string, number>();
    
    // Update prediction counts
    predictions.set(winner, (predictions.get(winner) || 0) + 1);
    
    // Save updated predictions
    fight.predictions = predictions;
    await fight.save();

    // Calculate percentages
    let total = 0;
    const percentages: { [key: string]: number } = {};
    
    // First calculate total
    predictions.forEach((count: number) => {
      total += count;
    });
    
    // Then calculate percentages
    predictions.forEach((count: number, fighter: string) => {
      percentages[fighter] = Math.round((count / total) * 100);
    });

    return NextResponse.json(percentages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit prediction' }, { status: 500 })
  }
}

