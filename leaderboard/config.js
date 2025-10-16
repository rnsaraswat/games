export const SUPABASE_URL = 'https://bkhoexvgorxzgdujofar.supabase.co/functions/v1/submit-score';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ';

// curl -X POST \
//   -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
//   -H "Content-Type: application/json" \
//   -d '{\"player_name\":\"Ravi\",\"email\":\"test@example.com\",\"game_id\":\"tictactoe\",\"score\":150}' \
  https://bkhoexvgorxzgdujofar.supabase.co/functions/v1/submit-score

// curl -L -X POST "https://bkhoexvgorxzgdujofar.supabase.co/functions/v1/submit-score" ^
//   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraG9leHZnb3J4emdkdWpvZmFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MTE3NDgsImV4cCI6MjA3NjA4Nzc0OH0.DG1jB5GDBJAtfOsJF0KjO8luVVTLTgx6MlZIvj_v7IQ ^
//   -H "Content-Type: application/json" ^
//   -d "{\"player_name\":\"Ravi\",\"email\":\"test@example.com\",\"game_id\":\"tictactoe\",\"score\":150}"