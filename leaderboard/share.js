document.getElementById("shareBtn").addEventListener("click", async () => {
    
    const siteLogoUrl = "../../assets/icons/maskable-icon.png";  
    const siteName = "Ravindra Games Hub";
    const gameName = "Memory Game";
    const score = 320;
    const gameLink = "https://rnsaraswat.github.io/games/play?game=memory";

    const textToShare = 
`${siteName}
${gameName}
Score: ${score}

Play here:
${gameLink}`;

    try {
        const imgBlob = await (await fetch(siteLogoUrl)).blob();
        const file = new File([imgBlob], "../../assets/icons/maskable-icon.png", { type: "image/png" });

        // -----------------------
        // MOBILE SHARE (if supported)
        // -----------------------
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                title: siteName,
                text: textToShare,
                files: [file]
            });
            console.log("Shared via mobile!");
            return;
        }

        // -----------------------
        // DESKTOP FALLBACK
        // -----------------------
        console.log("Desktop detected → native share not supported");

        // 1️⃣ Image download
        const url = URL.createObjectURL(imgBlob);
        const a = document.getElementById("downloadLink");
        a.href = url;
        a.download = "shared-image.png";
        a.style.display = "inline-block";
        a.textContent = "Download Image (Desktop)";
        alert(
"⚠ Desktop browsers native image sharing support नहीं करते.\n\n" +
"👉 Image download कर सकते हैं\n👉 Text + Link नीचे copy कर सकते हैं"
        );

        console.log("Fallback text:", textToShare);

        // 2️⃣ Copy link automatically
        navigator.clipboard.writeText(textToShare);

    } catch (err) {
        console.error("Share failed:", err);
    }
});