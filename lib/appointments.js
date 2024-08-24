// This is a placeholder. In a real application, you'd interact with a database.
let appointments = [
  {
    date: '2023-06-01T00:00:00.000Z',
    time: '2:00 PM',
    name: 'Test Patient',
    phone: '1234567890',
    email: 'test@example.com'
  }
];

export async function getAvailableSlots(date) {
  // Generate all possible time slots
  const allSlots = [
    '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM',
    '02:00 PM', '02:15 PM', '02:30 PM', '02:45 PM',
    '03:00 PM', '03:15 PM', '03:30 PM', '03:45 PM',
    '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM'
  ];

  // Filter out booked slots
  const bookedSlots = appointments
    .filter(a => new Date(a.date).toDateString() === new Date(date).toDateString())
    .map(a => a.time);

  return allSlots.filter(slot => !bookedSlots.includes(slot));
}

export async function bookAppointment(appointmentData) {
  appointments.push(appointmentData);
  console.log('Appointment booked:', appointmentData);
  return { success: true };
}

export async function getDoctorAppointments() {
  return appointments;
}

export async function getAvailableAndBookedSlots(date) {
  // Implement the logic to get both available and booked slots
  // This will depend on your database structure and ORM
  // Return an object with availableSlots and bookedSlots arrays
}

export async function getAllAppointments() {
  console.log('Getting all appointments:', appointments);
  return appointments;
}