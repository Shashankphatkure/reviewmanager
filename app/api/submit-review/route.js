import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(request) {
  const {
    name,
    phoneNumber,
    email,
    overallRating,
    qualityRating,
    quantityRating,
    serviceRating,
    description,
  } = await request.json();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          name,
          phone_number: phoneNumber,
          email,
          overall_rating: overallRating,
          quality_rating: qualityRating,
          quantity_rating: quantityRating,
          service_rating: serviceRating,
          description,
        },
      ]);

    if (error) throw error;

    return NextResponse.json(
      { message: "Review submitted successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { message: "Error submitting review" },
      { status: 500 }
    );
  }
}
