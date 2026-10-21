(() => {
  "use strict";
  const {ChessGame,SIDE}=window.RGHChess;
  const game=new ChessGame();
  const $=id=>document.getElementById(id);
  const boardEl=$("board");
  let soundEnabled=localStorage.getItem("rghChessSound")!=="off";
  let audioContext=null;
  const tapSound=()=>{
    if(!soundEnabled)return;
    try {
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      audioContext ||= new AC();
      if(audioContext.state==="suspended")audioContext.resume();
      const osc=audioContext.createOscillator(),gain=audioContext.createGain();
      osc.type="sine";osc.frequency.value=660;gain.gain.setValueAtTime(.0001,audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.07,audioContext.currentTime+.01);
      gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.09);
      osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.1);
    } catch(e) { /* Audio is optional; gameplay remains available. */ }
  };
  function render(){
    boardEl.innerHTML="";
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const p=game.board[r][c],selected=game.selected&&game.selected[0]===r&&game.selected[1]===c;
      const target=game.legalTargets.some(([rr,cc])=>rr===r&&cc===c);
      const btn=document.createElement("button");
      btn.type="button";btn.className="square "+((r+c)%2===0?"light":"dark")+(selected?" selected":"");
      btn.setAttribute("role","gridcell");btn.setAttribute("aria-label",`${String.fromCharCode(97+c)}${8-r}${p?", "+p.side+" "+p.kind:""}${target?", legal target":""}`);
      if(target){const mark=document.createElement("span");mark.className=p?"target-capture":"target-dot";btn.append(mark);}
      if(p){const span=document.createElement("span");span.className="piece "+p.side;span.textContent=p.symbol;btn.append(span);}
      if(r===7){const coord=document.createElement("span");coord.className="coord file";coord.textContent=String.fromCharCode(97+c);btn.append(coord);}
      if(c===0){const coord=document.createElement("span");coord.className="coord rank";coord.textContent=String(8-r);btn.append(coord);}
      btn.addEventListener("click",()=>handleSquare(r,c));boardEl.append(btn);
    }
    $("status").textContent=game.message;
    $("movesCount").textContent=String(game.moves);
    $("undoBtn").disabled=game.undoStack.length===0;
    $("capturedBlack").textContent=game.capturedBlack.map(p=>p.symbol).join(" ")||"—";
    $("capturedWhite").textContent=game.capturedWhite.map(p=>p.symbol).join(" ")||"—";
    const history=$("history");history.innerHTML="";
    if(!game.moveHistory.length)history.textContent="No moves yet.";
    else for(let i=0;i<game.moveHistory.length;i+=2){
      const row=document.createElement("div");row.className="history-row";
      row.textContent=`${Math.floor(i/2)+1}.  ${game.moveHistory[i].notation}${game.moveHistory[i+1]?"    "+game.moveHistory[i+1].notation:""}`;
      history.append(row);
    }
  }
  function handleSquare(r,c){
    const before=game.moveHistory.length;
    const moved=game.tap(r,c);
    if(moved){tapSound();if(game.computerEnabled&&game.turn===SIDE.BLACK&&!game.gameOver){
      render();
      // Keep the interface responsive while the AI searches.
      window.setTimeout(()=>{const computerMoved=game.playComputerMove();if(computerMoved)tapSound();render();},40);
      return;
    }}
    render();
  }
  $("modeSelect").addEventListener("change",e=>{
    tapSound();game.computerEnabled=e.target.value==="computer";
    game.selected=null;game.legalTargets=[];
    $("levelSelect").hidden=!game.computerEnabled;$("levelLabel").hidden=!game.computerEnabled;
    if(game.computerEnabled&&game.turn===SIDE.BLACK&&!game.gameOver){
      window.setTimeout(()=>{if(game.playComputerMove())tapSound();render();},40);
    }
    render();
  });
  $("levelSelect").addEventListener("change",e=>{tapSound();game.difficulty=e.target.value;});
  $("newBtn").addEventListener("click",()=>{tapSound();const enabled=game.computerEnabled,difficulty=game.difficulty;game.reset();game.computerEnabled=enabled;game.difficulty=difficulty;render();});
  $("undoBtn").addEventListener("click",()=>{tapSound();game.undoTurn();render();});
  $("deselectBtn").addEventListener("click",()=>{tapSound();game.selected=null;game.legalTargets=[];render();});
  $("soundBtn").textContent=soundEnabled?"♪ Sound On":"♪ Sound Off";
  $("soundBtn").setAttribute("aria-pressed",String(soundEnabled));
  $("soundBtn").addEventListener("click",()=>{soundEnabled=!soundEnabled;localStorage.setItem("rghChessSound",soundEnabled?"on":"off");$("soundBtn").textContent=soundEnabled?"♪ Sound On":"♪ Sound Off";$("soundBtn").setAttribute("aria-pressed",String(soundEnabled));if(soundEnabled)tapSound();});
  const themes=["light","dark","blue","orange"];
  let theme=localStorage.getItem("rghChessTheme")||"light";
  if(theme!=="light")document.body.dataset.theme=theme;
  $("themeBtn").addEventListener("click",()=>{tapSound();theme=themes[(themes.indexOf(theme)+1)%themes.length];if(theme==="light")delete document.body.dataset.theme;else document.body.dataset.theme=theme;localStorage.setItem("rghChessTheme",theme);});
  render();
})();