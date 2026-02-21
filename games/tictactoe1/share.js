import { gameName, score } from './tictactoe1.js';

export async function shareScore(gameName, score = 0) {

  console.log("shareScore",gameName, score);

  const siteName = "Ravindra Games Hub";
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
    await navigator.share({
      title: siteName,
      text: textToShare
    });
    console.log("try", gameLink);

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
}

document.getElementById("shareBtn").addEventListener("click", async () => {
  console.log("share.js button",gameName, score);
  shareScore(gameName, score);
  console.log("share.js button after",gameName, score);
});

document.getElementById("nativeShare").addEventListener("click", async () => {
  // console.log("share.js button",gameName, score);
  // shareScore(gameName, score);
  // console.log("share.js button after",gameName, score);
  console.log("shareScore",gameName, score);

  const siteName = "Ravindra Games Hub";
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
    await navigator.share({
      title: siteName,
      text: textToShare
    });
    console.log("try", gameLink);

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
});
