import { useDoctors } from '@/hooks/useDoctors'

const Doctors = () => {
  const { data: doctors, isLoading, error } = useDoctors()

  if (isLoading) return <div>Loading doctors...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!doctors || doctors.length === 0) return <div>No doctors found. Add data in Supabase.</div>

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Doctors</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold">{doctor.name}</h2>
            <p className="text-gray-600">Specialization: {doctor.specialization?.join(', ')}</p>
            <p className="text-sm text-gray-500">Status: {doctor.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors
