import "jsr:@supabase/functions-js/edge-runtime.d.ts";
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

    const { id, title, description, goal, deadline, charity_percentage, image, ticket_price, total_tickets, total_funds_raised, created_by } = await req.json();

    const { data, error } = await supabase
      .from("causes")
      .insert({ id, title, description, goal, deadline, charity_percentage, image, ticket_price, created_by }, { onConflict: ["id"] });

    if (error) {
      throw new Error(error.message);
    }

    return new Response(
      JSON.stringify({
        message: "Cause created successfully",
        data,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
