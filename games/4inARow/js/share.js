  const score = 420;

  // 1) canvas पर एक simple image बनाना (score दिखे)
  function makeScoreImage(score) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630; // common social card size
    const ctx = canvas.getContext('2d');

    // background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // big score text
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 120px sans-serif';
    ctx.fillText(`${score}`, canvas.width/2, canvas.height/2 - 20);

    ctx.font = '28px sans-serif';
    ctx.fillText('Can you beat my score?', canvas.width/2, canvas.height/2 + 70);

    return canvas;
  }

  async function shareScore() {
    const url = new URL(window.location.href);
    url.searchParams.set('score', score);

    // If Web Share + files supported -> create blob from canvas and share
    const canvas = makeScoreImage(score);
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    const file = new File([blob], 'score.png', { type: 'image/png' });

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
