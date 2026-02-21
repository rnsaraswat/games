// share.js

window.shareMobile = async function () {

    // Mobile + native share check
    if (!navigator.share || !/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      console.log("Mobile native share not supported");
      return;
    }
  
    const siteName = window.siteName || "Ravindra Games Hub";
    const gameName = window.gameName || "My Game";
    const score = window.finalScore || 0;
    const link = window.location.href;
  
    const text =
  `${siteName}
  ${gameName}
  Score: ${score}
  
  Play here:
  ${link}`;
  
    try {
      await navigator.share({
        title: siteName,
        text: text
      });
    } catch (e) {
      console.log("Share cancelled");
    }
  };
  