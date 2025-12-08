// share.js - robust, queueing, waits for popup to be injected

(function () {
    // util
    function isMobile() {
      return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
  
    // wait for popup element ready (resolves even if already present)
    function waitForPopup(timeout = 3000) {
      return new Promise((resolve) => {
        if (document.getElementById("sharePopup")) return resolve(true);
  
        // if popup loader sets flag/event
        if (window.__sharePopupLoaded === true && document.getElementById("sharePopup")) return resolve(true);
  
        let resolved = false;
        const onLoaded = () => {
          if (!resolved) {
            resolved = true;
            document.removeEventListener("sharePopupLoaded", onLoaded);
            resolve(true);
          }
        };
        document.addEventListener("sharePopupLoaded", onLoaded);
  
        // timeout fallback
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            document.removeEventListener("sharePopupLoaded", onLoaded);
            resolve(!!document.getElementById("sharePopup"));
          }
        }, timeout);
      });
    }
  
    // generate small share image via canvas (logo + game + score + bg)
    async function generateImage({ game, score, image, logo = "images/RGHlogo.png", bgFallback = "images/green-paint-brush-textured.jpg" }) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 800; canvas.height = 420;
        const ctx = canvas.getContext("2d");
  
        // draw background (image if provided)
        const bg = new Image();
        bg.crossOrigin = "anonymous";
        bg.src = image || bgFallback;
        await bg.decode().catch(()=>{ /* ignore */ });
        if (bg.width) ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
        else { ctx.fillStyle = "#222"; ctx.fillRect(0,0,canvas.width,canvas.height); }
  
        // overlay
        ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.fillRect(0,0,canvas.width,canvas.height);
  
        // logo
        const lg = new Image();
        lg.crossOrigin = "anonymous";
        lg.src = logo;
        await lg.decode().catch(()=>{ /* ignore */ });
        if (lg.width) ctx.drawImage(lg, 24, 24, 120, 120);
  
        // texts
        ctx.fillStyle = "#fff";
        ctx.font = "bold 70px sans-serif";
        ctx.fillText("Ravindra Games Hub", 120, 20);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText(game || "Game", 160, 80);
  
        ctx.fillStyle = "#00ff90";
        ctx.font = "bold 56px sans-serif";
        ctx.fillText("Score: " + (typeof score !== "undefined" ? score : 0), 160, 160);
  
        // convert to blob URL
        return await new Promise((res) => {
          canvas.toBlob((b) => res(URL.createObjectURL(b)), "image/jpeg", 0.9);
        });
      } catch (e) {
        console.warn("generateImage failed", e);
        return null;
      }
    }
  
    // open popup and fill values (assumes popup present)
    async function showPopup(shareData, imageURL) {
      await waitForPopup();
      const popup = document.getElementById("sharePopup");
      if (!popup) {
        console.warn("Popup not available");
        return;
      }
  
      // fill UI
      const titleEl = document.getElementById("shareText") || document.getElementById("shareTitle");
      if (titleEl) titleEl.textContent = `${shareData.game} — Score: ${shareData.score}`;
  
      const imgPrev = document.getElementById("shareImagePreview");
      if (imgPrev) imgPrev.style.backgroundImage = imageURL ? `url('${imageURL}')` : (shareData.image ? `url('${shareData.image}')` : "");
  
      const linkInput = document.getElementById("shareLinkInput");
      if (linkInput) linkInput.value = shareData.link || window.location.href;
  
      // set social links
      const text = encodeURIComponent(`${shareData.game} — Score: ${shareData.score}`);
      const u = encodeURIComponent(shareData.link || window.location.href);
  
      const wa = document.getElementById("whatsappShare");
      if (wa) wa.href = `https://wa.me/?text=${text}%0A${u}`;
  
      const fb = document.getElementById("facebookShare");
      if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
  
      const tg = document.getElementById("telegramShare");
      if (tg) tg.href = `https://t.me/share/url?url=${u}&text=${text}`;
  
      const tw = document.getElementById("twitterShare");
      if (tw) tw.href = `https://twitter.com/intent/tweet?text=${text}&url=${u}`;
  
      const ig = document.getElementById("instagramShare");
      if (ig) ig.href = "https://www.instagram.com/direct/inbox/";
  
      // attach copy/close
      const copyBtn = document.getElementById("copyBtn");
      if (copyBtn) copyBtn.onclick = () => {
        navigator.clipboard.writeText(linkInput.value).then(()=> alert("Link copied"));
      };
  
      const closeBtn = document.getElementById("closePopup");
      if (closeBtn) closeBtn.onclick = () => { popup.style.display = "none"; };
  
      // show
      popup.style.display = "flex";
    }
  
    // Queue: if popup not loaded yet, push into pendingRequests
    const pending = [];
  
    // main API: call this to request share
    window.requestShare = async function (data) {
      // normalize
      const shareData = {
        game: data.game || "Game",
        score: typeof data.score !== "undefined" ? data.score : 0,
        link: data.link || window.location.href,
        image: data.image || null
      };
  
      // ensure popup loaded or wait if not
      const popupReady = document.getElementById("sharePopup") || window.__sharePopupLoaded;
      if (!popupReady) {
        // queue and return (it will be handled on 'sharePopupLoaded' event)
        pending.push(shareData);
        // also set a fallback timeout: attempt after small delay
        setTimeout(() => {
          if (pending.length) processPending();
        }, 800);
        return;
      }
  
      // generate image then share
      const imageURL = await generateImage(shareData);
      // mobile native share (try)
      if (isMobile() && navigator.share) {
        try {
          if (imageURL) {
            // fetch blob
            const resp = await fetch(imageURL);
            const blob = await resp.blob();
            const file = new File([blob], "share.jpg", { type: blob.type });
            await navigator.share({ title: shareData.game, text: `${shareData.game} — Score: ${shareData.score}`, url: shareData.link, files: [file] });
            return;
          } else {
            await navigator.share({ title: shareData.game, text: `${shareData.game} — Score: ${shareData.score}`, url: shareData.link });
            return;
          }
        } catch (e) {
          console.warn("native share failed", e);
          // fallback to popup
        }
      }
  
      // desktop / fallback: show popup with image and links
      await showPopup(shareData, imageURL);
    };
  
    // process queued requests when popup loads
    document.addEventListener("sharePopupLoaded", () => {
      if (pending.length === 0) return;
      // process only the last request (user likely clicked again); you can process all if you want
      const last = pending.pop();
      // clear pending
      pending.length = 0;
      // call requestShare again
      window.requestShare(last);
    });
  
    // also if popup was injected before share.js loaded, dispatch event to process
    if (window.__sharePopupLoaded) {
      document.dispatchEvent(new Event("sharePopupLoaded"));
    }
  
  })();
  