import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CategoryRow = {
  id?: string | number;
  title?: string | null;
  name?: string | null;
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
  const { data, error } = await supabase.from("category").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as CategoryRow[];

  const categories = rows.map((row) => {
    const title =
      (typeof row.title === "string" && row.title) ||
      (typeof row.name === "string" && row.name) ||
      "Untitled";

    return {
      id: row.id ?? title,
      name: title,
    };
  });

  return NextResponse.json({ categories });
}
