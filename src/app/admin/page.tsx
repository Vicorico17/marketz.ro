'use client'

import AddFightForm from '@/components/AddFightForm'
import FightList from '@/components/FightList'

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Add New Fight</h2>
          <AddFightForm />
        </section>
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">All Fights</h2>
          <FightList />
        </section>
      </div>
    </div>
  )
}

