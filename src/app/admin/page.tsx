import AdminFightList from '../components/AdminFightList'
import AddFightForm from '../components/AddFightForm'

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <AddFightForm />
      <AdminFightList />
    </main>
  )
}

