import { NextResponse } from 'next/server'
import { Fight } from '../../../../../app/types/fight'

// This would typically be replaced with a database
let fights: Fight[] = [
  { id: '1', fighter1: 'John Doe', fighter2: 'Jane Smith', date: '2023-06-01', category: 'Lightweight' },
  { id: '2', fighter1: 'Mike Johnson', fighter2: 'Sarah Williams', date: '2023-06-15', category: 'Middleweight' },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  const fight = fights.find(f => f.id === id)
  
  if (fight) {
    return NextResponse.json(fight)
  } else {
    return NextResponse.json({ error: 'Fight not found' }, { status: 404 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
  fights = fights.filter(fight => fight.id !== id)
  return NextResponse.json({ message: 'Fight deleted' }, { status: 200 })
}

