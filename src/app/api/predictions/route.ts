import { NextResponse } from 'next/server'

interface Prediction {
  fightId: string
  winner: string
}

// This would typically be replaced with a database
let predictions: Prediction[] = []

export async function POST(request: Request) {
  const { fightId, winner } = await request.json()
  const newPrediction: Prediction = { fightId, winner }
  predictions.push(newPrediction)
  return NextResponse.json(newPrediction, { status: 201 })
}

