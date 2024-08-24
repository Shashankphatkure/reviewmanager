import { NextResponse } from 'next/server';
import { bookAppointment } from '../../../lib/appointments';

export async function POST(request) {
  const appointmentData = await request.json();

  try {
    console.log('Booking appointment:', appointmentData);
    await bookAppointment(appointmentData);
    return NextResponse.json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}