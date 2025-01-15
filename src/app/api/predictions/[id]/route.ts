import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'
import mongoose from 'mongoose'

interface FightDocument extends mongoose.Document {
  predictions: Map<string, number>;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const fight = await Fight.findById(params.id) as FightDocument;
    
    if (fight) {
      // Convert Map to regular object for JSON serialization
      const predictionsObj: { [key: string]: number } = {};
      if (fight.predictions) {
        fight.predictions.forEach((value, key) => {
          predictionsObj[key] = value;
        });
      }
      return NextResponse.json(predictionsObj)
    } else {
      return NextResponse.json({ error: 'Fight not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Failed to fetch predictions:', error)
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 })
  }
}

