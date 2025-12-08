// document.getElementById("shareBtn").addEventListener("click", async () => {
import { gameName, score } from './script.js';

async function shareScore(gameName, score = 0) {


  const siteName = "Ravindra Games Hub";
  // const gameName = gameName;
  // const gameName = "Memory Game";
  // const score = 320;
  // const gameLink = "https://rnsaraswat.github.io/games/play?game=memory";
  const gameLink = `https://rnsaraswat.github.io/games/games/${gameName}/index.html`;

  const textToShare =
    `${siteName}
${gameName}
Can you beat my Score: ${score}

Play here:
${gameLink}`;

  console.log(gameLink)
  const imageUrl = "../../assets/icons/maskable-icon.png";

  try {
    // -----------------------
    // STEP 1 → Share TEXT first
    // -----------------------
    await navigator.share({
      title: siteName,
      text: textToShare
    });

    // -----------------------
    // STEP 2 → Share IMAGE after text
    // -----------------------
    const blob = await (await fetch(imageUrl)).blob();
    const file = new File([blob], "../../assets/icons/maskable-icon.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file]
      });
    }

  } catch (err) {
    console.log("Share cancelled or failed", err);
  }
  // });
}

document.getElementById("shareBtn").addEventListener("click", async () => {
  shareScore(gameName, score)
});
