import { NextResponse } from 'next/server'
import { Fight } from '../../../../app/types/fight'

// This would typically be replaced with a database
let fights: Fight[] = [
  { id: '1', fighter1: 'John Doe', fighter2: 'Jane Smith', date: '2023-06-01', category: 'Lightweight' },
  { id: '2', fighter1: 'Mike Johnson', fighter2: 'Sarah Williams', date: '2023-06-15', category: 'Middleweight' },
]

export async function GET() {
  return NextResponse.json(fights)
}

export async function POST(request: Request) {
  const { fighter1, fighter2, date, category } = await request.json()
  const newFight: Fight = { 
    id: Date.now().toString(), 
    fighter1, 
    fighter2, 
    date, 
    category 
  }
  fights.push(newFight)
  return NextResponse.json(newFight, { status: 201 })
}

