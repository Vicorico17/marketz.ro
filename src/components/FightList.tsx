'use client'

import { useState, useEffect } from 'react'
import { Fight } from '@/types/fight'
import FightCard from './FightCard'

interface MongoFight extends Omit<Fight, 'id'> {
  _id: string;
}

export default function FightList() {
  const [fights, setFights] = useState<Fight[]>([])

  useEffect(() => {
    const fetchFights = async () => {
      try {
        const response = await fetch('/api/fights')
        const data: MongoFight[] = await response.json()
        
        // Transform MongoDB documents to our Fight interface format
        const transformedFights = data.map(fight => ({
          id: fight._id,
          fighter1: fight.fighter1,
          fighter2: fight.fighter2,
          fighter1Image: fight.fighter1Image,
          fighter2Image: fight.fighter2Image,
          date: fight.date,
          category: fight.category,
          predictions: fight.predictions
        }))
        
        setFights(transformedFights)
      } catch (error) {
        console.error('Failed to fetch fights:', error)
      }
    }
    
    fetchFights()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fights.map((fight) => (
        <FightCard key={fight.id} fight={fight} />
      ))}
    </div>
  )
}

