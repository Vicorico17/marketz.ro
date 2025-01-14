'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual login logic
    console.log('Login attempt with:', email, password)
    // Redirect to home page after login (replace with actual logic later)
    router.push('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Image src="/street-logo.png" alt="marketz.ro logo" width={128} height={128} />
        <h1 className="text-5xl font-bold mb-2 text-center text-yellow-400">Login to marketz.ro</h1>
        <p className="red-text text-2xl">Access your street cred</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-black bg-opacity-50 p-8 rounded-lg">
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-yellow-400">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-yellow-400">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-yellow-400 text-black py-2 rounded hover:bg-yellow-500 font-bold">
          Login
        </button>
      </form>
    </div>
  )
}

