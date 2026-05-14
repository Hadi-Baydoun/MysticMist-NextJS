import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SpecialTagRow = {
  id?: string;
  name?: string;
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
  const { data, error } = await supabase.from("special_tags").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as SpecialTagRow[];

  const special_tags = rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
    };
  });

  return NextResponse.json({ special_tags });
}
