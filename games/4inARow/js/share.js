// document.getElementById("shareBtn").addEventListener("click", async () => {
import { gameName, score } from './script.js';

export async function shareScore(gameName, score = 0) {

  console.log("shareScore",gameName, score);

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

  console.log("gamelink", gameLink);
  const imageUrl = "../../assets/icons/maskable-icon.png";

  try {
    // -----------------------
    // STEP 1 → Share TEXT first
    // -----------------------
    await navigator.share({
      title: siteName,
      text: textToShare
    });
    console.log("try", gameLink);

    // -----------------------
    // STEP 2 → Share IMAGE after text
    // -----------------------
    const blob = await (await fetch(imageUrl)).blob();
    const file = new File([blob], "../../assets/icons/maskable-icon.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file]
      });
    console.log("navigator.canShare && navigator.canShare", file, blob);
  }

  } catch (err) {
    console.log("Share cancelled or failed", err);
  }
  // });
}

document.getElementById("shareBtn").addEventListener("click", async () => {
  console.log("share.js button",gameName, score);
  shareScore(gameName, score);
  console.log("share.js button after",gameName, score);
});
