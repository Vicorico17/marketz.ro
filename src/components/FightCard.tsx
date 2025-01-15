'use client'

import { useState, useEffect } from 'react'
import { Fight } from '@/types/fight'
import Image from 'next/image'

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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="relative h-48 bg-gray-800 rounded-lg overflow-hidden">
          {fight.fighter1Image ? (
            <Image
              src={fight.fighter1Image}
              alt={fight.fighter1}
              fill
              style={{ objectFit: 'cover' }}
              className="hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <div className="relative h-48 bg-gray-800 rounded-lg overflow-hidden">
          {fight.fighter2Image ? (
            <Image
              src={fight.fighter2Image}
              alt={fight.fighter2}
              fill
              style={{ objectFit: 'cover' }}
              className="hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
      </div>
      <p className="mb-4">Date: {new Date(fight.date).toLocaleDateString()}</p>
      <p className="mb-4">Category: {fight.category}</p>
      <div className="flex justify-between gap-4">
        <button
          onClick={() => handlePrediction(fight.fighter1)}
          className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${
            prediction === fight.fighter1 ? 'bg-green-500' : 'bg-gray-700'
          } ${hasVoted ? 'cursor-not-allowed' : 'hover:bg-gray-600 hover:scale-105'}`}
          disabled={hasVoted}
        >
          <div className="text-lg font-semibold">{fight.fighter1}</div>
          <div className="text-sm opacity-75">({percentages[fight.fighter1] || 0}%)</div>
        </button>
        <button
          onClick={() => handlePrediction(fight.fighter2)}
          className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${
            prediction === fight.fighter2 ? 'bg-green-500' : 'bg-gray-700'
          } ${hasVoted ? 'cursor-not-allowed' : 'hover:bg-gray-600 hover:scale-105'}`}
          disabled={hasVoted}
        >
          <div className="text-lg font-semibold">{fight.fighter2}</div>
          <div className="text-sm opacity-75">({percentages[fight.fighter2] || 0}%)</div>
        </button>
      </div>
      {hasVoted && (
        <p className="mt-4 text-center text-yellow-400">You've already voted for this fight!</p>
      )}
    </div>
  )
}

