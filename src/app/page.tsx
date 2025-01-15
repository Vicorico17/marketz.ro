'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import FightList from '@/components/FightList'
import AddFightForm from '@/components/AddFightForm'

console.log('Home component file loaded');

export default function Home() {
  console.log('Home component rendering');
  
  const [showAddFight, setShowAddFight] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const testMongoDB = async () => {
    try {
      console.log('Testing MongoDB connection...');
      const response = await fetch('/api/test');
      const data = await response.json();
      console.log('Test response:', data);
      alert(data.success ? 'MongoDB test successful!' : 'MongoDB test failed: ' + data.error);
    } catch (error) {
      console.error('Test error:', error);
      alert('Test failed: ' + String(error));
    }
  }

  useEffect(() => {
    console.log('Home component mounted');
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0,
        backgroundColor: 'black',
        color: 'white',
        padding: '1rem',
        zIndex: 1000
      }}>
        <h2>Debug Panel</h2>
        <p>showAddFight: {String(showAddFight)}</p>
        <button
          onClick={testMongoDB}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test MongoDB Connection
        </button>
      </div>

      <header className="flex flex-col items-center mb-8 mt-16">
        <div className="flex items-center">
          <Image src="/street-logo.png" alt="marketz.ro logo" width={64} height={64} />
          <h1 className="text-5xl font-bold ml-4 text-yellow-400">marketz.ro</h1>
        </div>
        <p className="red-text text-2xl mt-4">Street-style predictions</p>
      </header>
      
      <div className="flex flex-col items-center mb-8">
        <button 
          onClick={() => {
            console.log('Toggle button clicked, current state:', showAddFight);
            setShowAddFight(!showAddFight);
          }}
          className="text-yellow-400 hover:underline text-xl mb-4"
        >
          {showAddFight ? 'Hide Add Fight' : 'Add Fight'}
        </button>

        {showAddFight && (
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Fight</h2>
            <AddFightForm onSuccess={() => {
              console.log('Fight added successfully');
              window.location.reload();
            }} />
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        <FightList />
      </div>
    </main>
  )
}

