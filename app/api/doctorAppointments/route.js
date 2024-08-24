import { NextResponse } from 'next/server';
import { getAllAppointments } from '../../../lib/appointments';

export async function GET() {
  try {
    console.log('Fetching all appointments...')
    const appointments = await getAllAppointments();
    console.log('Fetched appointments:', appointments)
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}