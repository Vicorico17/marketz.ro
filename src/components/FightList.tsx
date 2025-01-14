'use client'

import { useState, useEffect } from 'react'
import { Fight } from '../types/fight'
import FightCard from './FightCard'

export default function FightList() {
  const [fights, setFights] = useState<Fight[]>([])

  useEffect(() => {
    const fetchFights = async () => {
      const response = await fetch('/api/fights')
      const data = await response.json()
      setFights(data)
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

