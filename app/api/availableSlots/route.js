import { NextResponse } from 'next/server';
import { getAvailableAndBookedSlots } from '../../../lib/appointments';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  
  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  const { availableSlots, bookedSlots } = await getAvailableAndBookedSlots(new Date(date));
  return NextResponse.json({ availableSlots, bookedSlots });
}