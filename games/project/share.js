// window.shareMobile = async function () {

//   // Mobile + native share check
//   if (!navigator.share || !/Android|iPhone|iPad/i.test(navigator.userAgent)) {
//     console.log("Mobile native share not supported");
//     return;
//   }

//   const siteName = window.siteName || "Ravindra Games Hub";
//   const gameName = window.gameName || "My Game";
//   const score = window.finalScore || 0;
//   const link = window.location.href;

//   const text =
// `${siteName}
// ${gameName}
// Score: ${score}

// Play here:
// ${link}`;

//   try {
//     await navigator.share({
//       title: siteName,
//       text: text
//     });
//   } catch (e) {
//     console.log("Share cancelled");
//   }
// };


// import { gameName, score } from './script.js';

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
    const file = new File([blob], "../assets/icons/maskable-icon.png", { type: "image/png" });

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

// document.getElementById("shareBtn2").addEventListener("click", async () => {
//   console.log("share.js button");
//   shareScore(gameName, score);
//   console.log("share.js button after",gameName, score);
// });
