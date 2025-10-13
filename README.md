# Ravindra Games Hub


Simple collection of web games (TicTacToe, Mastermind) — PWA-ready and Supabase-backed leaderboard.


## Quick start
1. Create a Supabase project and run the SQL to create `scores` table.
2. Copy `leaderboard/config.example.js` to `leaderboard/config.js` and add your SUPABASE_URL and SUPABASE_ANON_KEY.
3. Push to GitHub and enable Pages (branch: main).
4. Open site, sign-in (Google) and play — Top 10 scores will appear in Leaderboard.


## Notes
- For production security: implement an Edge Function that uses Supabase service_role key to accept signed score submissions.
- Keep `leaderboard/config.js` out of public commits if you prefer secrecy; use server-side secrets instead.