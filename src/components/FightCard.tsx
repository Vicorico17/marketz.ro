'use client'

import { useState, useEffect } from 'react'
import { Fight } from '../../app/types/fight'

interface FightCardProps {
  fight: Fight
}

export default function FightCard({ fight }: FightCardProps) {
  const [prediction, setPrediction] = useState<string | null>(null)
  const [percentages, setPercentages] = useState<{ [key: string]: number }>({})
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    const storedPrediction = localStorage.getItem(`prediction_${fight.id}`)
    if (storedPrediction) {
      setPrediction(storedPrediction)
      setHasVoted(true)
    }
    fetchPercentages()
  }, [fight.id])

  const fetchPercentages = async () => {
    const response = await fetch(`/api/predictions/${fight.id}`)
    const data = await response.json()
    setPercentages(data)
  }

  const handlePrediction = async (winner: string) => {
    if (!hasVoted) {
      setPrediction(winner)
      setHasVoted(true)
      localStorage.setItem(`prediction_${fight.id}`, winner)
      await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fightId: fight.id, winner }),
      })
      await fetchPercentages()
    }
  }

  return (
    <div className="bg-black bg-opacity-50 shadow-md rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">{fight.fighter1} vs {fight.fighter2}</h2>
      <p className="mb-4">Date: {new Date(fight.date).toLocaleDateString()}</p>
      <p className="mb-4">Category: {fight.category}</p>
      <div className="flex justify-between">
        <button
          onClick={() => handlePrediction(fight.fighter1)}
          className={`px-4 py-2 rounded ${
            prediction === fight.fighter1 ? 'bg-green-500' : 'bg-gray-700'
          } ${hasVoted ? 'cursor-not-allowed' : 'hover:bg-gray-600'}`}
          disabled={hasVoted}
        >
          {fight.fighter1} ({percentages[fight.fighter1] || 0}%)
        </button>
        <button
          onClick={() => handlePrediction(fight.fighter2)}
          className={`px-4 py-2 rounded ${
            prediction === fight.fighter2 ? 'bg-green-500' : 'bg-gray-700'
          } ${hasVoted ? 'cursor-not-allowed' : 'hover:bg-gray-600'}`}
          disabled={hasVoted}
        >
          {fight.fighter2} ({percentages[fight.fighter2] || 0}%)
        </button>
      </div>
      {hasVoted && (
        <p className="mt-4 text-center text-yellow-400">You've already voted for this fight!</p>
      )}
    </div>
  )
}

