  const score = 420;

  // 1) canvas पर एक simple image बनाना (score दिखे)
  function makeScoreImage(gamename, score) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630; // common social card size
    const ctx = canvas.getContext('2d');

    // background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = '../../assets/icons/maskable-icon.png';
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
    ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2 + 50);

    ctx.font = 'italic 100px Georgia';
    text = gamename;
    metrics = ctx.measureText(text);
    textWidth = metrics.width;
    console.log(textWidth);
    ctx.fillText(text, (canvas.width - textWidth) / 2, canvas.height / 2 + 150);

    ctx.font = '50px Verdana';
    // score = 250
    text = 'Can you beat my score:' + score;
    metrics = ctx.measureText(text);
    textWidth = metrics.width;
    console.log(textWidth);
    ctx.fillText(text, canvas.width / 2 - 350, canvas.height / 2 + 220);

    return canvas;
  }

  async function shareScore(gameName, score) {
    const url = new URL(`https://rnsaraswat.github.io/games/`);
    url.searchParams.set('score', score);

    // If Web Share + files supported -> create blob from canvas and share
    const canvas = makeScoreImage(gameName, score);
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

  document.getElementById('nativeShare').addEventListener('click', shareScore);
