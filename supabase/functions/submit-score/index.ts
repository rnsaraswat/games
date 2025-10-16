// // Secure Supabase Edge Function: submit-score
// // Deploy with: supabase functions deploy submit-score


// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


// serve(async (req) => {
//     if (req.method !== "POST") {
//         return new Response(JSON.stringify({ error: "Only POST allowed" }), {
//             status: 405,
//         });
//     }


//     const { player_name, email, game_id, score } = await req.json();


//     if (!player_name || !game_id || typeof score !== "number") {
//         return new Response(JSON.stringify({ error: "Invalid input" }), {
//             status: 400,
//         });
//     }


//     const supabase = createClient(
//         Deno.env.get("SUPABASE_URL")!,
//         Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//     );


//     const { error } = await supabase.from("scores").insert([
//         { player_name, email, game_id, score },
//     ]);


//     if (error) {
//         console.error(error);
//         return new Response(JSON.stringify({ success: false, error }), {
//             status: 500,
//         });
//     }


//     return new Response(JSON.stringify({ success: true }), { status: 200 });
// });





import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
    try {
        const data = await req.json();
        const { player_name, email, game_id, score } = data;

        const { error } = await supabase
            .from("scores")
            .insert([{ player_name, email, game_id, score }]);

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 400 });
        }

        return new Response(
            JSON.stringify({ message: "Score saved successfully!" }),
            { headers: { "Content-Type": "application/json" }, status: 200 }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});
