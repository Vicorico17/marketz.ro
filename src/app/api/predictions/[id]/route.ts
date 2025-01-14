import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Fight from '@/models/Fight'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const fight = await Fight.findById(params.id);
    
    if (fight) {
      return NextResponse.json(fight.predictions || {})
    } else {
      return NextResponse.json({ error: 'Fight not found' }, { status: 404 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 })
  }
}

