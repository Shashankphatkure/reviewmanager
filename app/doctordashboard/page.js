'use client'

import { useState, useEffect } from 'react'

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching appointments...')
      const response = await fetch('/api/doctorAppointments')
      if (!response.ok) throw new Error('Failed to fetch appointments')
      const data = await response.json()
      console.log('Fetched appointments:', data.appointments)
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
      // Optionally, display an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  console.log('Rendering appointments:', appointments)

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Appointments</h2>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <p className="text-center py-4">Loading appointments...</p>
            ) : appointments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-4">No appointments found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}