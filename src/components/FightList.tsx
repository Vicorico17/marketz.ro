'use client'

import { useState, useEffect } from 'react'
import { Fight } from '@/types/fight'
import FightCard from './FightCard'

interface MongoFight extends Omit<Fight, 'id'> {
  _id: string;
}

export default function FightList() {
  const [fights, setFights] = useState<Fight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`])
  }

  useEffect(() => {
    const fetchFights = () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get fights from localStorage
        const fights = JSON.parse(localStorage.getItem('fights') || '[]');
        alert(`Found ${fights.length} fights in localStorage`);
        setFights(fights);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch fights'
        setError(errorMessage)
        alert('Error loading fights: ' + errorMessage)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFights()
  }, [])

  return (
    <div>
      {/* Debug information */}
      <div className="mb-8 p-4 bg-black bg-opacity-50 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-2">Debug Information</h2>
        <div className="text-sm text-gray-300 space-y-1">
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Number of fights: {fights.length}</p>
          <div className="mt-2">
            <p className="font-semibold">Log:</p>
            {debugInfo.map((info, index) => (
              <p key={index} className="font-mono">{info}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-white">Loading fights...</div>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && fights.length === 0 && (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-white">No fights found</div>
        </div>
      )}

      {/* Fight list */}
      {!loading && !error && fights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fights.map((fight) => (
            <FightCard key={fight.id} fight={fight} />
          ))}
        </div>
      )}
    </div>
  )
}

