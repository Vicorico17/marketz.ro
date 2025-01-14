'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AddGame() {
  const [fighter1, setFighter1] = useState('')
  const [fighter2, setFighter2] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newGame = { fighter1, fighter2, date, category }
    
    try {
      const response = await fetch('/api/fights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      })
      
      if (response.ok) {
        router.push('/')
      } else {
        console.error('Failed to add game')
      }
    } catch (error) {
      console.error('Error adding game:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Image src="/street-logo.png" alt="marketz.ro logo" width={128} height={128} />
        <h1 className="text-5xl font-bold mb-2 text-center text-yellow-400">Add New Game - marketz.ro</h1>
        <p className="red-text text-2xl">Set up the next street battle</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-black bg-opacity-50 p-8 rounded-lg">
        <div className="mb-4">
          <label htmlFor="fighter1" className="block mb-2 text-yellow-400">Fighter 1</label>
          <input
            type="text"
            id="fighter1"
            value={fighter1}
            onChange={(e) => setFighter1(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fighter2" className="block mb-2 text-yellow-400">Fighter 2</label>
          <input
            type="text"
            id="fighter2"
            value={fighter2}
            onChange={(e) => setFighter2(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block mb-2 text-yellow-400">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block mb-2 text-yellow-400">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 font-bold">
          Add Game
        </button>
      </form>
    </div>
  )
}

