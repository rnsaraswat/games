// import { gameName, score } from './script.js';

export async function shareScore(gameName, score = 0) {

    console.log("shareScore", gameName, score);

    const siteName = "Ravindra Games Hub";
    let gameLink = `https://rnsaraswat.github.io/games/index.html`;
    let textToShare;
    if (gameName == '-') {
        gameLink = `https://rnsaraswat.github.io/games/index.html`;
    
        textToShare =
            `${siteName}
            Play here:
        ${gameLink}`;
    } else {
        gameLink = `https://rnsaraswat.github.io/games/games/${gameName}/index.html`;
    
        textToShare =
            `${siteName}
        ${gameName}
        Can you beat my Score: ${score}
        
        Play here:
        ${gameLink}`;
        console.log("gamelink", gameLink);
    }

    const imageUrl = "../games/assets/icons/maskable-icon.png";

    try {
        await navigator.share({
            title: siteName,
            text: textToShare
        });
        console.log("try", gameLink);

        const blob = await (await fetch(imageUrl)).blob();
        const file = new File([blob], "../games/assets/icons/maskable-icon.png", { type: "image/png" });

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

// document.getElementById("shareBtn").addEventListener("click", async () => {
//     shareScore(gameName, score);
// });
