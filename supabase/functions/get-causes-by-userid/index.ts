import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { ...corsHeaders, Authorization: req.headers.get("Authorization")! } },
    });

    const url = new URL(req.url);
    const address = url.searchParams.get("address");
    if (!address) {
      throw new Error("address query parameter is required");
    }

    // get all causes
    const { data, error } = await supabase
      .from("causes")
      .select("*")
      .eq("created_by", address);

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        data,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
})
