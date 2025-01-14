import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'
import { Fight as FightType } from '@/types/fight'

export async function GET() {
  try {
    await connectDB();
    const fights = await Fight.find({}).sort({ date: 1 });
    return NextResponse.json(fights)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch fights' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { fighter1, fighter2, date, category } = await request.json()
    const newFight = await Fight.create({ 
      fighter1, 
      fighter2, 
      date, 
      category,
      predictions: new Map()
    })
    return NextResponse.json(newFight, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create fight' }, { status: 500 })
  }
}

