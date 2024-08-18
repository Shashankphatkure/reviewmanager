import { NextResponse } from "next/server";

export async function POST(request) {
  const { rating, description } = await request.json();

  // Here, you would typically save the review to your database
  // This is a placeholder implementation
  console.log("Received review:", { rating, description });

  // Simulating a successful save
  return NextResponse.json(
    { message: "Review submitted successfully" },
    { status: 200 }
  );
}
