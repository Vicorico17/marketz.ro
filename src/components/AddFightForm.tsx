'use client'

import { useState } from 'react'

export default function AddFightForm() {
  const [fighter1, setFighter1] = useState('')
  const [fighter2, setFighter2] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/fights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fighter1, fighter2, date }),
    })
    setFighter1('')
    setFighter2('')
    setDate('')
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Add New Fight</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          value={fighter1}
          onChange={(e) => setFighter1(e.target.value)}
          placeholder="Fighter 1"
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="text"
          value={fighter2}
          onChange={(e) => setFighter2(e.target.value)}
          placeholder="Fighter 2"
          className="border rounded px-2 py-1"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1"
          required
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Add Fight
      </button>
    </form>
  )
}

