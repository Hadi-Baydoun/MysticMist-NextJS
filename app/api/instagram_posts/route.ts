import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type InstagramPostRow = {
  id?: string;
  link?: string;
  image?: string;
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
  const { data, error } = await supabase
    .from("instagram_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as InstagramPostRow[];

  const instagram_posts = rows.map((row) => {
    return {
      id: row.id,
      link: row.link,
      image: row.image,
    };
  });

  return NextResponse.json({ instagram_posts });
}
