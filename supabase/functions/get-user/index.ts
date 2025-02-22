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
    const wallet_address = url.searchParams.get("wallet_address");
    if (!wallet_address) {
      throw new Error("wallet_address query parameter is required");
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("wallet_address", wallet_address)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({
          data: null,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
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
