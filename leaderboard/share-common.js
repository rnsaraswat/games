// Mobile Detection
function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

async function generateShareImage(gameName, score, bgImage, logoImage) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 420;
        const ctx = canvas.getContext("2d");

        const bg = new Image();
        bg.src = bgImage;

        const logo = new Image();
        logo.src = logoImage;

        bg.onload = () => {
            ctx.drawImage(bg, 0, 0, 800, 420);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, 800, 420);

            ctx.fillStyle = "#fff";
            ctx.font = "48px Arial";
            ctx.fillText(gameName, 40, 120);

            ctx.font = "36px Arial";
            ctx.fillText("Score: " + score, 40, 190);

            logo.onload = () => {
                ctx.drawImage(logo, 650, 20, 120, 120);
                canvas.toBlob((blob) => resolve(URL.createObjectURL(blob)));
            };
        };
    });
}


async function shareScore(gameName, score = 0, bgImage = "../../assets/images/green-paint-brush-textured.jpg") {
    const shareURL = window.location.href;
    const imageURL = await generateShareImage(gameName, score, bgImage, "../../assets/icons/maskable-icon.png");

    // BOTH DEVICE FIX
    // कुछ मोबाइल share() सपोर्ट करते हैं, कुछ नहीं
    if (isMobile()) {

        if (navigator.share) {
            try {
                const response = await fetch(imageURL);
                const blob = await response.blob();

                await navigator.share({
                    title: gameName,
                    text: `My Score: ${score}`,
                    url: shareURL,
                    files: [new File([blob], "share.jpg", { type: "image/jpeg" })]
                });
                return;
            } catch (err) {
                console.log("Native share failed, fallback to popup");
            }
        }
    }

    // DESKTOP + fallback for unsupported mobile
    openSharePopup(shareURL, gameName, score, imageURL);
}


// POPUP SHOW
function openSharePopup(url, gameName, score, imageURL) {
    setTimeout(() => {
        document.getElementById("shareGeneratedImage").src = imageURL;
        document.getElementById("shareLinkText").textContent = url;

        document.getElementById("waLink").href =
            `https://web.whatsapp.com/send?text=Score%20${score}%0A${url}`;

        document.getElementById("tgLink").href =
            `https://t.me/share/url?url=${url}&text=Score%20${score}`;

        document.getElementById("fbLink").href =
            `https://www.facebook.com/sharer/sharer.php?u=${url}`;

        document.getElementById("twLink").href =
            `https://twitter.com/intent/tweet?url=${url}&text=Score%20${score}`;

        document.getElementById("instaMsg").onclick = () => {
            alert("Instagram browser sharing allow नहीं करता।");
        };

        document.getElementById("shareOverlay").style.display = "flex";
    }, 300);
}

function closeSharePopup() {
    document.getElementById("shareOverlay").style.display = "none";
}

function copyShareLink() {
    const text = document.getElementById("shareLinkText").textContent;
    navigator.clipboard.writeText(text);
    alert("Link Copied!");
}
