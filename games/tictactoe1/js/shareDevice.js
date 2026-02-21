import { shareScore } from '../share.js';
let score = 500;
let game = "menu";
let shareText = "";
let shareURL = `https://rnsaraswat.github.io/games/index.html`

document.getElementById("shareDetectDevice").addEventListener("click", async () => {
    score = 500;
    game = "menu";

    isMobileDevice();
    console.log(getDeviceType());

    window.detectDevicePara(game, score);
});

const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "Tablet";
    }
    if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "Mobile";
    }
    return "Desktop";
};

/* javascript code for share link/button for browser and mobile */

// Detect Mobile Browser
function isMobile() {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
}

window.detectDevicePara = async function (gameName, game, score) {

    // getDeviceType()

    if (gameName === "menu") {
        shareText = `Play Games on Ravindra Games Hub`;
        shareURL = `https://rnsaraswat.github.io/games/index.html`;
    } else {
        if (score == 0) {
            shareText = `Play and enjoy! ${gameName}`;
        } else {
            shareText = `I scored ${score} points! Try to beat my Score! in ${gameName}`;
        }
        shareURL = `https://rnsaraswat.github.io/games/games/${game}/index.html`;
    }
    // const shareURL = "https://yourdomain.com/share.html?score=" + score;

    // --------------------------
    // 📱 MOBILE SHARE
    // --------------------------
    // if (isMobile() && navigator.share) {
    if (getDeviceType() == "Desktop") {
                // Encode
                const t = encodeURIComponent(shareText);
                const u = encodeURIComponent(shareURL);
        
                // Twitter
                document.getElementById("twLink").href =
                    `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
        
                // WhatsApp Web
                document.getElementById("waLink").href =
                    `https://web.whatsapp.com/send?text=${t}%20${u}`;
        
                // Facebook Share
                document.getElementById("fbLink").href =
                    `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        
                // Telegram Web
                document.getElementById("tgLink").href =
                    `https://t.me/share/url?url=${u}&text=${t}`;
        
                // // Instagram (guide to direct message)
                document.getElementById("igLink").href =
                    `https://www.instagram.com/direct/inbox/`;
        
                // Show Popup
                document.getElementById("sharePopup").style.display = "flex";
        
                document.getElementById("closePopup").addEventListener("click", () => {
                    document.getElementById("sharePopup").style.display = "none";
                });

    } else {
        if (isMobile() && navigator.share) {
            try {
                await navigator.share({
                    title: "Ravindra Games Hub",
                    text: shareText,
                    url: shareURL
                });
                return;
            } catch (e) { }
        }
    }

    // --------------------------
    // 💻 DESKTOP SHARE POPUP
    // --------------------------


}
// document.getElementById("shareBtn2").addEventListener("click", async () => {

// });

const isMobileDevice = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // 1. Check for Touch Points (Modern way)
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    // 2. Check for Small Screen (Mobile typically < 768px)
    const isSmallScreen = window.innerWidth <= 768;
  
    // 3. User Agent keywords (Fallback)
    const uaCheck = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
    // Agar touch hai aur screen choti hai, ya user agent match ho raha hai
    // return (isTouch && isSmallScreen) || uaCheck;
    return true;
  };
  
  if (isMobileDevice()) {
    console.log("Yeh Mobile hai!");
    alert("Yeh Mobile hai!");
    shareScore("tictactoe", 0);
    // window.shareOnMobile();
    // if (navigator.share) {
        // try {
        //     await navigator.share({
        //         title: "Ravindra Games Hub",
        //         text: shareText,
        //         url: shareURL
        //     });
        //     // return;
        // } catch (e) { }
    // }
    alert("Yeh Mobile hai!");
  } else {
    console.log("Yeh Desktop hai!");
    window.detectDevicePara();
    alert("Yeh Desktop hai!");

  }

  window.shareOnMobile = async function (gameName, game, score) {

    if (gameName === "menu") {
        shareText = `Play Games on Ravindra Games Hub`;
        shareURL = `https://rnsaraswat.github.io/games/index.html`;
    } else {
        if (score == 0) {
            shareText = `Play and enjoy! ${gameName}`;
        } else {
            shareText = `I scored ${score} points! Try to beat my Score! in ${gameName}`;
        }
        shareURL = `https://rnsaraswat.github.io/games/games/${game}/index.html`;
    }
    // const shareURL = "https://yourdomain.com/share.html?score=" + score;

    // --------------------------
    // 📱 MOBILE SHARE
    // --------------------------
    // if (isMobile() && navigator.share) {
    // if (getDeviceType() == "Desktop") {
    //             // Encode
    //             const t = encodeURIComponent(shareText);
    //             const u = encodeURIComponent(shareURL);
        
    //             // Twitter
    //             document.getElementById("twLink").href =
    //                 `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
        
    //             // WhatsApp Web
    //             document.getElementById("waLink").href =
    //                 `https://web.whatsapp.com/send?text=${t}%20${u}`;
        
    //             // Facebook Share
    //             document.getElementById("fbLink").href =
    //                 `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        
    //             // Telegram Web
    //             document.getElementById("tgLink").href =
    //                 `https://t.me/share/url?url=${u}&text=${t}`;
        
    //             // // Instagram (guide to direct message)
    //             document.getElementById("igLink").href =
    //                 `https://www.instagram.com/direct/inbox/`;
        
    //             // Show Popup
    //             document.getElementById("sharePopup").style.display = "flex";
        
    //             document.getElementById("closePopup").addEventListener("click", () => {
    //                 document.getElementById("sharePopup").style.display = "none";
    //             });

    // } else {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Ravindra Games Hub",
                    text: shareText,
                    url: shareURL
                });
                return;
            } catch (e) { }
        }
    // }

    // --------------------------
    // 💻 DESKTOP SHARE POPUP
    // --------------------------


}

  window.shareOnDesktop = async function (gameName, game, score) {

    if (gameName === "menu") {
        shareText = `Play Games on Ravindra Games Hub`;
        shareURL = `https://rnsaraswat.github.io/games/index.html`;
    } else {
        if (score == 0) {
            shareText = `Play and enjoy! ${gameName}`;
        } else {
            shareText = `I scored ${score} points! Try to beat my Score! in ${gameName}`;
        }
        shareURL = `https://rnsaraswat.github.io/games/games/${game}/index.html`;
    }
    // const shareURL = "https://yourdomain.com/share.html?score=" + score;

    // --------------------------
    // 📱 MOBILE SHARE
    // --------------------------
    // if (isMobile() && navigator.share) {
    // if (getDeviceType() == "Desktop") {
                // Encode
                const t = encodeURIComponent(shareText);
                const u = encodeURIComponent(shareURL);
        
                // Twitter
                document.getElementById("twLink").href =
                    `https://twitter.com/intent/tweet?text=${t}&url=${u}`;
        
                // WhatsApp Web
                document.getElementById("waLink").href =
                    `https://web.whatsapp.com/send?text=${t}%20${u}`;
        
                // Facebook Share
                document.getElementById("fbLink").href =
                    `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        
                // Telegram Web
                document.getElementById("tgLink").href =
                    `https://t.me/share/url?url=${u}&text=${t}`;
        
                // // Instagram (guide to direct message)
                document.getElementById("igLink").href =
                    `https://www.instagram.com/direct/inbox/`;
        
                // Show Popup
                document.getElementById("sharePopup").style.display = "flex";
        
                document.getElementById("closePopup").addEventListener("click", () => {
                    document.getElementById("sharePopup").style.display = "none";
                });

    // } else {
    //     if (isMobile() && navigator.share) {
    //         try {
    //             await navigator.share({
    //                 title: "Ravindra Games Hub",
    //                 text: shareText,
    //                 url: shareURL
    //             });
    //             return;
    //         } catch (e) { }
    //     }
    }

    // --------------------------
    // 💻 DESKTOP SHARE POPUP
    // --------------------------

