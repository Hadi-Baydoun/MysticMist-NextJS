import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type TestimonialRow = {
  id?: string;
  name?: string;
  location?: string;
  rating?: number;
  text?: string;
  avatar_url?: string;
};

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: "Missing Supabase configuration" },
      { status: 500 },
    );
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("testimonials").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as TestimonialRow[];

  const testimonials = rows.map((row) => {
    return {
      id: row.id ?? row.name,
      name: row.name,
      location: row.location,
      rating: row.rating,
      text: row.text,
      avatar_url: row.avatar_url,
    };
  });

  return NextResponse.json({ testimonials });
}
