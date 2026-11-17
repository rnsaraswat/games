// Share helper adapted for Ravindra Games Hub Chess.
export async function shareScore(gameName = "Chess", score = 0) {
  const siteName = "Ravindra Games Hub";
  const gameLink = `https://rnsaraswat.github.io/games/games/${encodeURIComponent(String(gameName).toLowerCase())}/index.html`;
  const text = `${siteName}\n${gameName}\nCan you beat my Score: ${score}\n\nPlay here:\n${gameLink}`;
  const data = { title: `${siteName} — ${gameName}`, text, url: gameLink };
  if (navigator.share) {
    try { await navigator.share(data); return true; }
    catch (err) { if (err && err.name === "AbortError") return false; }
  }
  try { await navigator.clipboard.writeText(text); alert("Share text copied to clipboard."); return true; }
  catch (_) { window.prompt("Copy this game link and message:", text); return false; }
}
export async function shareGame() { return shareScore("Chess", 0); }
