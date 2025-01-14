import Link from 'next/link'
import Image from 'next/image'
import FightList from './components/FightList'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <header className="flex flex-col items-center mb-8">
        <div className="flex items-center">
          <Image src="/street-logo.png" alt="marketz.ro logo" width={64} height={64} />
          <h1 className="text-5xl font-bold ml-4 text-yellow-400">marketz.ro</h1>
        </div>
        <p className="red-text text-2xl mt-4">Street-style predictions</p>
      </header>
      <nav className="flex justify-center mb-8">
        <Link href="/login" className="text-yellow-400 hover:underline mr-4 text-xl">
          Login
        </Link>
        <Link href="/add-game" className="text-yellow-400 hover:underline text-xl">
          Add Game
        </Link>
      </nav>
      <FightList />
    </main>
  )
}

