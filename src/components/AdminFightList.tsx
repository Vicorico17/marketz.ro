'use client'

import { useState, useEffect } from 'react'
import { Fight } from '../../app/types/fight'

export default function AdminFightList() {
  const [fights, setFights] = useState<Fight[]>([])

  useEffect(() => {
    const fetchFights = async () => {
      const response = await fetch('/api/fights')
      const data = await response.json()
      setFights(data)
    }
    fetchFights()
  }, [])

  const handleDelete = async (id: string) => {
    await fetch(`/api/fights/${id}`, { method: 'DELETE' })
    setFights(fights.filter((fight) => fight.id !== id))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Fights</h2>
      <ul>
        {fights.map((fight) => (
          <li key={fight.id} className="mb-4 p-4 bg-gray-100 rounded">
            <p>
              {fight.fighter1} vs {fight.fighter2} - {new Date(fight.date).toLocaleDateString()}
            </p>
            <button
              onClick={() => handleDelete(fight.id)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

