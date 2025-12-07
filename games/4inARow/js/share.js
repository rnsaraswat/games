  const score = 420;
  const outputImage = document.getElementById('outputImage');
  // 1) canvas पर एक simple image बनाना (score दिखे)
  function makeScoreImage(gamename, score) {
    score = (typeof score !== 'undefined') ? score : 100;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 630; // common social card size
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // const img = new Image();
    // img.src = '../../assets/icons/maskable-icon.png';
    
    // img.crossOrigin = "Anonymous";
    // img.onload = () => {
      // background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0,0,canvas.width,canvas.height);

    // ctx.drawImage(img, 300, 30, 500, 250);
    // big score text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.font = 'bold 100px Arial';
    let text = 'Ravindra Games Hub';
    let metrics = ctx.measureText(text);
    let textWidth = metrics.width;
    console.log(textWidth);
    ctx.fillText(text, 580, 250);
    // ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2 + 50);

    ctx.font = 'italic 100px Georgia';
    text = gamename;
    metrics = ctx.measureText(text);
    textWidth = metrics.width;
    console.log(textWidth);
    ctx.fillText(text, 530, 350);
    // ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2 + 150);

    ctx.font = '50px Verdana';
    // score = 250
    text = 'Can you beat my score:' + score;
    metrics = ctx.measureText(text);
    textWidth = metrics.width;
    console.log(textWidth);
    ctx.fillText(text, 600, 400);
    // ctx.fillText(text, canvas.width / 2 - 350, canvas.height / 2 + 220);



    // 3. कैनवास को इमेज डेटा URL में बदलें
    const imageDataURL = canvas.toDataURL('image/png');

    // 4. इमेज टैग में सोर्स सेट करें और उसे दिखाएं
    outputImage.src = imageDataURL;
    outputImage.style.display = 'block';
    outputImage.style.width = '50%';
    outputImage.style.margin = '1vw';


    console.log(canvas);
    return canvas;
    // }
  }

  async function shareScore(gameName, score) {
    console.log(gameName);
    const url = new URL(`https://rnsaraswat.github.io/games/games/${gameName}/`);
    url.searchParams.set('score', score);

    // If Web Share + files supported -> create blob from canvas and share
    const canvas = makeScoreImage(gameName, score);
    console.log(canvas)
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const file = new File([blob], 'score.png', { type: 'image/png' });

    document.getElementById("shareGeneratedImg").src = canvas;

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'My Score',
          text: `I scored ${score} points!`,
          url: url.toString(),
          files: [file]
        });
        console.log('Shared successfully');
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else if (navigator.share) {
      // fallback: share without file
      try {
        await navigator.share({
          title: 'My Score',
          text: `I scored ${score} points! ${url.toString()}`,
          url: url.toString()
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      // ultimate fallback: open twitter share dialog
      const text = encodeURIComponent(`I scored ${score} points! Can you beat me?`);
      const href = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url.toString())}`;
      window.open(href, '_blank', 'noopener');
    }
  }

  document.getElementById('nativeShare').addEventListener('click', shareScore("4inarow"));
