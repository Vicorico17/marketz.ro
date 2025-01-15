'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'

export default function AddFightForm() {
  const [fighter1, setFighter1] = useState('')
  const [fighter2, setFighter2] = useState('')
  const [fighter1Image, setFighter1Image] = useState('')
  const [fighter2Image, setFighter2Image] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/fights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fighter1,
          fighter2,
          fighter1Image,
          fighter2Image,
          date,
          category,
        }),
      })

      if (response.ok) {
        // Reset form
        setFighter1('')
        setFighter2('')
        setFighter1Image('')
        setFighter2Image('')
        setDate('')
        setCategory('')
        alert('Fight added successfully!')
      } else {
        alert('Failed to add fight')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to add fight')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 1</label>
          <input
            type="text"
            value={fighter1}
            onChange={(e) => setFighter1(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
          <div className="mt-4">
            <ImageUpload
              value={fighter1Image}
              onChange={setFighter1Image}
              label="Fighter 1 Image"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Fighter 2</label>
          <input
            type="text"
            value={fighter2}
            onChange={(e) => setFighter2(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
          <div className="mt-4">
            <ImageUpload
              value={fighter2Image}
              onChange={setFighter2Image}
              label="Fighter 2 Image"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
      >
        Add Fight
      </button>
    </form>
  )
}

