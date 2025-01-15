'use client'

import { useState, useEffect } from 'react'
import { Fight } from '@/types/fight'

interface MongoFight extends Omit<Fight, 'id'> {
  _id: string;
}

export default function AdminFightList() {
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/fights/${id}`, { 
        method: 'DELETE'
      })
      
      if (response.ok) {
        setFights(fights.filter((fight) => fight.id !== id))
      } else {
        console.error('Failed to delete fight')
      }
    } catch (error) {
      console.error('Error deleting fight:', error)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Fights</h2>
      {fights.length === 0 ? (
        <p className="text-gray-500">No fights found</p>
      ) : (
        <ul className="space-y-4">
          {fights.map((fight) => (
            <li key={fight.id} className="bg-black bg-opacity-50 p-6 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {fight.fighter1} vs {fight.fighter2}
                  </h3>
                  <p className="text-gray-300">
                    Date: {new Date(fight.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300">
                    Category: {fight.category}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(fight.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

