'use client'

import { useState } from 'react'
import ImageUpload from './ImageUpload'

interface AddFightFormProps {
  onSuccess?: () => void;
}

export default function AddFightForm({ onSuccess }: AddFightFormProps) {
  console.log('AddFightForm component rendering'); // Component mount log
  
  const [fighter1, setFighter1] = useState('')
  const [fighter2, setFighter2] = useState('')
  const [fighter1Image, setFighter1Image] = useState('')
  const [fighter2Image, setFighter2Image] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [lastAction, setLastAction] = useState<string>('None')

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toISOString()
    const logMessage = `${timestamp}: ${info}`
    setDebugInfo(prev => [...prev, logMessage])
    setLastAction(info)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('Starting form submission');
    
    try {
      setIsSubmitting(true)
      
      const fightData = {
        id: Date.now().toString(),
        fighter1,
        fighter2,
        fighter1Image,
        fighter2Image,
        date,
        category,
        predictions: {}
      }
      
      // Save to localStorage
      const existingFights = JSON.parse(localStorage.getItem('fights') || '[]');
      existingFights.push(fightData);
      localStorage.setItem('fights', JSON.stringify(existingFights));
      
      alert('Fight saved to localStorage!');
      
      // Reset form
      setFighter1('')
      setFighter2('')
      setFighter1Image('')
      setFighter2Image('')
      setDate('')
      setCategory('')
      
      // Trigger refresh
      onSuccess?.()
      window.location.reload()
    } catch (error) {
      alert('Error: ' + String(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div style={{ 
        backgroundColor: 'black',
        color: 'white',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '0.5rem'
      }}>
        <h3>Form State</h3>
        <pre>
          {JSON.stringify({
            fighter1,
            fighter2,
            date,
            category,
            isSubmitting
          }, null, 2)}
        </pre>
        <button
          onClick={async () => {
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
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test MongoDB Connection
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fighter 1</label>
            <input
              type="text"
              value={fighter1}
              onChange={(e) => {
                console.log('Fighter 1 changed:', e.target.value);
                setFighter1(e.target.value);
              }}
              required
              disabled={isSubmitting}
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
              onChange={(e) => {
                console.log('Fighter 2 changed:', e.target.value);
                setFighter2(e.target.value);
              }}
              required
              disabled={isSubmitting}
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
            onChange={(e) => {
              console.log('Date changed:', e.target.value);
              setDate(e.target.value);
            }}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => {
              console.log('Category changed:', e.target.value);
              setCategory(e.target.value);
            }}
            required
            disabled={isSubmitting}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => console.log('Submit button clicked')}
        >
          {isSubmitting ? 'Adding Fight...' : 'Add Fight'}
        </button>
      </form>
    </div>
  )
}

