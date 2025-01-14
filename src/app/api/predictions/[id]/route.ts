import { NextResponse } from 'next/server'

interface Prediction {
  fightId: string
  winner: string
}

// This would typically be replaced with a database
let predictions: Prediction[] = []

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const fightId = params.id
  const fightPredictions = predictions.filter(p => p.fightId === fightId)
  const total = fightPredictions.length

  if (total === 0) {
    return NextResponse.json({})
  }

  const counts: { [key: string]: number } = {}
  fightPredictions.forEach(p => {
    counts[p.winner] = (counts[p.winner] || 0) + 1
  })

  const percentages: { [key: string]: number } = {}
  Object.keys(counts).forEach(winner => {
    percentages[winner] = Math.round((counts[winner] / total) * 100)
  })

  return NextResponse.json(percentages)
}

