        // ─────────────────────────────
        // GLOBAL: Detect Mobile
        // ─────────────────────────────
        function isMobile() {
          return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      }

      // ─────────────────────────────
      // GLOBAL: Create Share Image
      // ─────────────────────────────
      async function generateShareImage(gameName, score) {
          return new Promise((resolve) => {
              const canvas = document.createElement("canvas");
              canvas.width = 900;
              canvas.height = 470;

              const ctx = canvas.getContext("2d");

              // Background
              ctx.fillStyle = "#1e1e1e";
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              // Logo
              const logo = new Image();
              logo.src = "../assets/icons/maskable-icon.png";   // ← अपनी logo image रखें

              logo.onload = () => {
                  ctx.drawImage(logo, 30, 30, 120, 120);

                  // Game name
                  ctx.fillStyle = "#fff";
                  ctx.font = "bold 45px Arial";
                  ctx.fillText(gameName, 180, 90);

                  // Score text
                  ctx.font = "bold 70px Arial";
                  ctx.fillStyle = "#00ff90";
                  ctx.fillText("Score: " + score, 180, 170);

                  // Footer
                  ctx.font = "28px Arial";
                  ctx.fillStyle = "#ccc";
                  ctx.fillText("Play now ➜ yoursite.com", 180, 230);

                  resolve(canvas.toDataURL("image/jpeg", 0.9));
              };
          });
      }

      // ─────────────────────────────
      // GLOBAL: Main share popup
      // ─────────────────────────────
      async function openShare(score, gameName) {
          const shareText = `${gameName}: I scored ${score}!`;
          const shareLink = `https://yoursite.com/play?game=${encodeURIComponent(gameName)}&score=${score}`;

          // First, generate image
          const imageURL = await generateShareImage(gameName, score);

          console.log(imageURL)
          console.log(shareText)
          console.log(shareLink)
          // MOBILE → Native Share
          if (isMobile() && navigator.share) {
              navigator.share({
                  title: gameName,
                  text: shareText,
                  url: shareLink,
              });
              return;
          }

          // DESKTOP → Open popup
          document.getElementById("sharePopup").style.display = "flex";

          document.getElementById("shareGeneratedImg").src = imageURL;

          // Set desktop share button links
          const url = encodeURIComponent(shareLink);
          const text = encodeURIComponent(shareText);

          document.getElementById("twLink").href =
              `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

          document.getElementById("fbLink").href =
              `https://www.facebook.com/sharer/sharer.php?u=${url}`;

          document.getElementById("waLink").href =
              `https://web.whatsapp.com/send?text=${text}%20${url}`;

          document.getElementById("tgLink").href =
              `https://t.me/share/url?url=${url}&text=${text}`;
      }

      // Close popup
      function closeSharePopup() {
          document.getElementById("sharePopup").style.display = "none";
      }
