import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const fight = await Fight.findById(params.id);
    
    if (fight) {
      // Convert Map to regular object for JSON serialization
      const predictions = Object.fromEntries(fight.predictions || new Map());
      return NextResponse.json(predictions)
    } else {
      return NextResponse.json({ error: 'Fight not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to fetch predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 })
  }
}

