'use client'

import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

export default function DoctorAppointment() {
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  })

  const [quickDates, setQuickDates] = useState([])

  // Define timeSlots
  const timeSlots = [
    '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM',
    '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
    '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
    '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM'
  ]

  const [availableSlots, setAvailableSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])

  useEffect(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    setQuickDates([
      { label: 'Today', date: today },
      { label: 'Tomorrow', date: tomorrow },
      { label: 'Day after', date: dayAfterTomorrow },
    ])
  }, [])

  useEffect(() => {
    // Fetch available slots when the date changes
    if (selectedDate) {
      console.log('Selected date:', selectedDate)
      fetchAvailableSlots(selectedDate)
    }
  }, [selectedDate])

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(`/api/availableSlots?date=${date.toISOString()}`)
      if (!response.ok) throw new Error('Failed to fetch available slots')
      const data = await response.json()
      console.log('Fetched data:', data)
      setAvailableSlots(data.availableSlots || timeSlots)
      setBookedSlots(data.bookedSlots || [])
    } catch (error) {
      console.error('Error fetching available slots:', error)
      setAvailableSlots(timeSlots)
      setBookedSlots([])
    }
  }

  const handleQuickDateSelect = (date) => {
    setSelectedDate(date)
    setStep(2)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    setStep(2)
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setStep(3)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const appointmentData = {
      date: selectedDate.toISOString(),
      time: selectedTime,
      name: formData.name,
      phone: formData.phone,
      email: formData.email
    }

    try {
      // Save appointment to backend
      const response = await fetch('/api/bookAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        throw new Error('Failed to book appointment')
      }

      // If successful, send WhatsApp message
      const message = `New appointment request:
Date: ${selectedDate.toLocaleDateString()}
Time: ${selectedTime}
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}`
      
      const whatsappUrl = `https://wa.me/918433804507?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')

      // Optionally, show a success message to the user
      alert('Appointment booked successfully!')

      // Reset form or navigate to a confirmation page
      setStep(1)
      setSelectedDate(null)
      setSelectedTime(null)
      setFormData({ name: '', phone: '', email: '' })

    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Doctor Appointment</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Book Your Visit</h1>
            
            {step === 1 && (
              <div className="mt-6">
                <h2 className="text-gray-700 text-sm font-medium mb-2">Select a Date</h2>
                <div className="flex space-x-2 mb-4">
                  {quickDates.map((quickDate, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickDateSelect(quickDate.date)}
                      className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {quickDate.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-700 text-sm font-medium mb-2">Or choose another date:</h3>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    inline
                    minDate={new Date()}
                    className="border-none shadow-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-6">
                <h2 className="text-gray-700 text-sm font-medium mb-2">Select a Time Slot</h2>
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((time, index) => {
                    const isBooked = bookedSlots.includes(time);
                    const isAvailable = availableSlots.includes(time);
                    return (
                      <button
                        key={index}
                        onClick={() => isAvailable && !isBooked && handleTimeSelect(time)}
                        className={`py-2 px-4 border border-transparent text-sm font-medium rounded-md 
                          ${isBooked 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : isAvailable
                              ? 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        disabled={isBooked || !isAvailable}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <h2 className="text-gray-700 text-sm font-medium mb-2">Enter Your Details</h2>
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}