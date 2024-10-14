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
    const id = url.searchParams.get("id");
    if (!id) {
      throw new Error("id query parameter is required");
    }

    const { data, error } = await supabase
      .from("causes")
      .select("*")
      .eq("id", id)
      .single();

    const { data: ticketsData, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .eq("cause_id", id);

    if (error || ticketsError) {
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
        tickets: {
          amount: ticketsData.reduce((acc, ticket) => acc + ticket.amount, 0),
          raised: ticketsData.reduce((acc, ticket) => acc + ticket.amount, 0) * data.ticket_price,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
})

