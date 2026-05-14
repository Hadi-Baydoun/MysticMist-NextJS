import { createClient } from "@supabase/supabase-js";

type TestimonialRow = {
  id?: string;
  name?: string;
  location?: string;
  rating?: number;
  text?: string;
  avatar_url?: string;
};

export type Testimonial = {
  id: string | number;
  name: string;
  location: string;
  rating: number;
  quote: string;
  image: string | null;
};

export type FetchTestimonialsResult =
  | { ok: true; testimonials: Testimonial[] }
  | { ok: false; error: string };

function rowToTestimonial(row: TestimonialRow, index: number): Testimonial {
  const avatar =
    typeof row.avatar_url === "string" && row.avatar_url.trim()
      ? row.avatar_url.trim()
      : null;

  return {
    id: row.id ?? row.name ?? index,
    name: row.name?.trim() || "",
    location: row.location?.trim() || "",
    rating:
      typeof row.rating === "number" && row.rating >= 1 && row.rating <= 5
        ? row.rating
        : 5,
    quote: row.text?.trim() || "",
    image: avatar,
  };
}

/** Server-side load for testimonials (`testimonials` table). */
export async function fetchTestimonials(): Promise<FetchTestimonialsResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return { ok: false, error: "Missing Supabase configuration" };
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from("testimonials").select("*");

  if (error) {
    return { ok: false, error: error.message };
  }

  const rows = (data ?? []) as TestimonialRow[];
  const testimonials = rows.map(rowToTestimonial);

  return { ok: true, testimonials };
}
