function isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }
  
  export function openSharePopup(score) {
    const shareLink  = "https://yourdomain.com/?score=" + score;
    const shareText  = `I scored ${score} points! Can you beat me?`;
  
    // MOBILE (Native)
    if (isMobile() && navigator.share) {
      navigator.share({
        title: "My Score",
        text: shareText,
        url: shareLink,
      });
      return;
    }
  
    // POPUP OPEN
    // document.getElementById("sharePopup").style.display = "flex";
    document.getElementById("shareText").innerText = shareText;
  
    const text = encodeURIComponent(shareText);
    const url  = encodeURIComponent(shareLink);
  
    // Correct share URLs
    document.getElementById("twLink").href =
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  
    document.getElementById("fbLink").href =
      `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  
    document.getElementById("waLink").href =
      `https://web.whatsapp.com/send?text=${text}%20${url}`;
  
    document.getElementById("tgLink").href =
      `https://t.me/share/url?url=${url}&text=${text}`;
  
    document.getElementById("instaLink").href =
      "https://www.instagram.com/";
  }
  
//   function closeSharePopup() {
//     document.getElementById("sharePopup").style.display = "none";
//   }