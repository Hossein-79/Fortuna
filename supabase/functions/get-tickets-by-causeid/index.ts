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
    const causeId = url.searchParams.get("causeid");
    if (!causeId) {
      throw new Error("causeid query parameter is required");
    }

    // get all causes
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("cause_id", causeId);

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
