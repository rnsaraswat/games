// Chess rules, AI, board UI and RGH integrations are kept in one file.
document.addEventListener("DOMContentLoaded", async () => {
  "use strict";
  const SIDE = { WHITE: "white", BLACK: "black" };
  const KINDS = ["rook","knight","bishop","queen","king","bishop","knight","rook"];
  const SYMBOLS = {
    white: { king:"♔", queen:"♕", rook:"♖", bishop:"♗", knight:"♘", pawn:"♙" },
    black: { king:"♚", queen:"♛", rook:"♜", bishop:"♝", knight:"♞", pawn:"♟" }
  };
  const VALUES = { pawn:1, knight:3, bishop:3, rook:5, queen:9, king:100 };
  const opposite = s => s === SIDE.WHITE ? SIDE.BLACK : SIDE.WHITE;
  const piece = (kind, side) => ({kind, side, symbol:SYMBOLS[side][kind]});
  const sq = (r,c) => `${String.fromCharCode(97+c)}${8-r}`;
  const cloneBoard = b => b.map(row => row.map(p => p ? {...p} : null));

  class ChessGame {
    constructor() {
      this.computerEnabled = true;
      this.difficulty = "Hard";
      this.reset();
    }
    reset() {
      this.board = Array.from({length:8}, () => Array(8).fill(null));
      for (let c=0;c<8;c++) {
        this.board[0][c] = piece(KINDS[c],SIDE.BLACK);
        this.board[1][c] = piece("pawn",SIDE.BLACK);
        this.board[6][c] = piece("pawn",SIDE.WHITE);
        this.board[7][c] = piece(KINDS[c],SIDE.WHITE);
      }
      this.turn=SIDE.WHITE; this.selected=null; this.legalTargets=[];
      this.message="White's turn"; this.gameOver=false; this.moves=0;
      this.moveHistory=[]; this.capturedWhite=[]; this.capturedBlack=[];
      this.undoStack=[];
      this.rights={whiteKing:false,blackKing:false,whiteA:false,whiteH:false,blackA:false,blackH:false};
      this.ep=null;
    }
    inside(r,c){return r>=0&&r<8&&c>=0&&c<8;}
    sameSide(a,b){return !!a&&!!b&&a.side===b.side;}
    tap(r,c) {
      if(this.gameOver||(this.computerEnabled&&this.turn===SIDE.BLACK)) return false;
      if(this.selected && this.legalTargets.some(([rr,cc])=>rr===r&&cc===c)) {
        this.makeMove(...this.selected,r,c);
        this.selected=null; this.legalTargets=[]; this.updateStatus(); return true;
      }
      const p=this.board[r][c];
      if(p&&p.side===this.turn){this.selected=[r,c];this.legalTargets=this.legalMoves(r,c);}
      else {this.selected=null;this.legalTargets=[];}
      return false;
    }
    setComputerEnabled(enabled){this.computerEnabled=enabled;if(enabled&&this.turn===SIDE.BLACK&&!this.gameOver)this.playComputerMove();}
    allLegalMoves(side){
      const out=[];
      for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(this.board[r][c]?.side===side)
        for(const [tr,tc] of this.legalMoves(r,c))out.push([r,c,tr,tc]);
      return out;
    }
    playComputerMove(){
      if(!this.computerEnabled||this.turn!==SIDE.BLACK||this.gameOver)return false;
      const depth=this.difficulty==="Easy"?1:this.difficulty==="Hard"?3:2;
      const moves=this.allLegalMoves(SIDE.BLACK);
      if(!moves.length){this.updateStatus();return false;}
      let best=null,bestScore=-1e8;
      for(const m of moves){
        const snap=this.snapshot();this.apply(...m);
        const score=-this.search(depth-1,-1e8,1e8,SIDE.WHITE);this.restore(snap);
        const jitter=this.difficulty==="Easy"?((m[0]*13+m[1]*7+moves.length)%9):0;
        if(score+jitter>bestScore){bestScore=score+jitter;best=m;}
      }
      if(!best){this.updateStatus();return false;}
      this.makeMove(...best);this.selected=null;this.legalTargets=[];this.updateStatus();return true;
    }
    search(depth,alpha,beta,side){
      if(depth<=0)return this.evaluate(side);
      const moves=this.allLegalMoves(side);
      if(!moves.length)return this.inCheck(side)?-90000-depth:0;
      let best=-1e8;
      for(const m of moves){
        const snap=this.snapshot();this.apply(...m);
        const score=-this.search(depth-1,-beta,-alpha,opposite(side));this.restore(snap);
        if(score>best)best=score;if(score>alpha)alpha=score;if(alpha>=beta)break;
      }
      return best;
    }
    evaluate(perspective){
      let score=0;
      for(let r=0;r<8;r++)for(let c=0;c<8;c++){
        const p=this.board[r][c];if(!p)continue;
        let v=VALUES[p.kind]*100+Math.round((3.5-Math.abs(c-3.5))*4);
        if(p.kind==="pawn")v+=(p.side===SIDE.WHITE?6-r:r-1)*3;
        score+=p.side===perspective?v:-v;
      }
      return score;
    }
    snapshot(){return {board:cloneBoard(this.board),turn:this.turn,moves:this.moves,rights:{...this.rights},ep:this.ep?{...this.ep}:null};}
    restore(s){this.board=cloneBoard(s.board);this.turn=s.turn;this.moves=s.moves;this.rights={...s.rights};this.ep=s.ep?{...s.ep}:null;}
    makeMove(fr,fc,tr,tc){
      const p=this.board[fr][fc];let captured=this.board[tr][tc];
      if(p.kind==="pawn"&&fc!==tc&&!captured&&this.ep&&tr===this.ep.r&&tc===this.ep.c)captured=this.board[fr][tc];
      this.undoStack.push({snapshot:this.snapshot(),historyLength:this.moveHistory.length});
      const notation=`${p.symbol}${sq(fr,fc)}${captured?"x":"-"}${sq(tr,tc)}${p.kind==="king"&&Math.abs(tc-fc)===2?" (castling)":""}`;
      const side=p.side;this.apply(fr,fc,tr,tc);
      if(captured){if(captured.side===SIDE.WHITE)this.capturedWhite.push(captured);else this.capturedBlack.push(captured);}
      this.moveHistory.push({notation,side,captured});
    }
    undoMove(){
      if(!this.undoStack.length)return false;
      const item=this.undoStack.pop();this.restore(item.snapshot);
      this.moveHistory.length=item.historyLength;
      this.capturedWhite=[];this.capturedBlack=[];
      for(const rec of this.moveHistory)if(rec.captured){(rec.captured.side===SIDE.WHITE?this.capturedWhite:this.capturedBlack).push(rec.captured);}
      this.selected=null;this.legalTargets=[];this.gameOver=false;this.updateStatus();return true;
    }
    undoTurn(){
      if(this.computerEnabled){if(this.turn===SIDE.WHITE&&this.undoStack.length)this.undoMove();if(this.undoStack.length)this.undoMove();}
      else this.undoMove();
    }
    apply(fr,fc,tr,tc){
      const p=this.board[fr][fc],oldEp=this.ep;this.ep=null;
      if(p.kind==="pawn"&&fc!==tc&&!this.board[tr][tc]&&oldEp&&tr===oldEp.r&&tc===oldEp.c)this.board[fr][tc]=null;
      if(p.kind==="king"&&Math.abs(tc-fc)===2){
        if(tc===6){this.board[tr][5]=this.board[tr][7];this.board[tr][7]=null;}
        else{this.board[tr][3]=this.board[tr][0];this.board[tr][0]=null;}
      }
      this.board[tr][tc]=p;this.board[fr][fc]=null;
      if(p.kind==="pawn"&&Math.abs(tr-fr)===2)this.ep={r:(tr+fr)/2,c:fc};
      if(p.kind==="pawn"&&(tr===0||tr===7))this.board[tr][tc]=piece("queen",p.side);
      if(p.kind==="king")this.rights[p.side+"King"]=true;
      if(p.kind==="rook"){
        if(fr===7&&fc===0)this.rights.whiteA=true;if(fr===7&&fc===7)this.rights.whiteH=true;
        if(fr===0&&fc===0)this.rights.blackA=true;if(fr===0&&fc===7)this.rights.blackH=true;
      }
      if(tr===7&&tc===0)this.rights.whiteA=true;if(tr===7&&tc===7)this.rights.whiteH=true;
      if(tr===0&&tc===0)this.rights.blackA=true;if(tr===0&&tc===7)this.rights.blackH=true;
      this.turn=opposite(this.turn);this.moves++;
    }
    legalMoves(r,c){
      const p=this.board[r][c];if(!p)return[];
      const out=[];
      for(let tr=0;tr<8;tr++)for(let tc=0;tc<8;tc++){
        if(!this.pseudoLegal(r,c,tr,tc))continue;
        const snap=this.snapshot();this.apply(r,c,tr,tc);const safe=!this.inCheck(p.side);this.restore(snap);
        if(safe)out.push([tr,tc]);
      }
      return out;
    }
    pseudoLegal(fr,fc,tr,tc){
      if(!this.inside(tr,tc)||(fr===tr&&fc===tc))return false;
      const p=this.board[fr][fc];if(!p||this.sameSide(p,this.board[tr][tc])||this.board[tr][tc]?.kind==="king")return false;
      const dr=tr-fr,dc=tc-fc,ar=Math.abs(dr),ac=Math.abs(dc);
      switch(p.kind){
        case "pawn":{
          const dir=p.side===SIDE.WHITE?-1:1,start=p.side===SIDE.WHITE?6:1;
          if(dc===0&&!this.board[tr][tc]&&dr===dir)return true;
          if(dc===0&&!this.board[tr][tc]&&fr===start&&dr===2*dir&&!this.board[fr+dir][fc])return true;
          if(ac===1&&dr===dir&&this.board[tr][tc])return true;
          return ac===1&&dr===dir&&this.ep&&tr===this.ep.r&&tc===this.ep.c&&this.board[fr][tc]?.kind==="pawn"&&this.board[fr][tc]?.side!==p.side;
        }
        case "knight":return(ar===2&&ac===1)||(ar===1&&ac===2);
        case "king":{
          if(ar<=1&&ac<=1)return true;
          if(dr!==0||ac!==2||this.inCheck(p.side))return false;
          const home=p.side===SIDE.WHITE?7:0;
          if(fr!==home||fc!==4||this.rights[p.side+"King"])return false;
          if(tc===6){
            if(this.rights[p.side+"H"]||this.board[home][7]?.kind!=="rook"||this.board[home][7]?.side!==p.side||this.board[home][5]||this.board[home][6])return false;
            return !this.squareAttacked(home,5,p.side)&&!this.squareAttacked(home,6,p.side);
          }
          if(tc===2){
            if(this.rights[p.side+"A"]||this.board[home][0]?.kind!=="rook"||this.board[home][0]?.side!==p.side||this.board[home][1]||this.board[home][2]||this.board[home][3])return false;
            return !this.squareAttacked(home,3,p.side)&&!this.squareAttacked(home,2,p.side);
          }
          return false;
        }
        case "rook":if(dr!==0&&dc!==0)return false;return this.clearPath(fr,fc,tr,tc);
        case "bishop":if(ar!==ac)return false;return this.clearPath(fr,fc,tr,tc);
        case "queen":if(!(dr===0||dc===0||ar===ac))return false;return this.clearPath(fr,fc,tr,tc);
      }
      return false;
    }
    clearPath(fr,fc,tr,tc){
      const sr=Math.sign(tr-fr),sc=Math.sign(tc-fc);let r=fr+sr,c=fc+sc;
      while(r!==tr||c!==tc){if(this.board[r][c])return false;r+=sr;c+=sc;}return true;
    }
    squareAttacked(r,c,defended){
      for(let rr=0;rr<8;rr++)for(let cc=0;cc<8;cc++){
        const p=this.board[rr][cc];if(p&&p.side!==defended&&this.attacks(rr,cc,r,c))return true;
      }return false;
    }
    inCheck(side){
      let kr=-1,kc=-1;
      for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=this.board[r][c];if(p?.kind==="king"&&p.side===side){kr=r;kc=c;}}
      if(kr<0)return true;return this.squareAttacked(kr,kc,side);
    }
    attacks(fr,fc,tr,tc){
      const p=this.board[fr][fc],dr=tr-fr,dc=tc-fc,ar=Math.abs(dr),ac=Math.abs(dc);
      switch(p.kind){
        case "pawn":return dr===(p.side===SIDE.WHITE?-1:1)&&ac===1;
        case "knight":return(ar===2&&ac===1)||(ar===1&&ac===2);
        case "king":return ar<=1&&ac<=1;
        case "rook":return(dr===0||dc===0)&&this.clearPath(fr,fc,tr,tc);
        case "bishop":return ar===ac&&this.clearPath(fr,fc,tr,tc);
        case "queen":return(dr===0||dc===0||ar===ac)&&this.clearPath(fr,fc,tr,tc);
      }return false;
    }
    hasAnyMove(side){for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(this.board[r][c]?.side===side&&this.legalMoves(r,c).length)return true;return false;}
    updateStatus(){
      const checked=this.inCheck(this.turn);
      if(!this.hasAnyMove(this.turn)){this.gameOver=true;this.message=checked?`Checkmate! ${this.turn===SIDE.WHITE?"Black":"White"} wins.`:"Draw — stalemate.";}
      else this.message=checked?`${this.turn==="white"?"White":"Black"} is in check!`:`${this.turn==="white"?"White":"Black"}'s turn`;
    }
  }


  const game=new ChessGame();
  const $=id=>document.getElementById(id);
  // Default mode: Player vs Computer, difficulty: Hard.
  $("modeSelect").value = "computer";
  $("levelSelect").value = "Hard";
  $("levelSelect").hidden = false;
  $("levelLabel").hidden = false;
  const boardEl=$("board");
  let soundEnabled = localStorage.getItem("rghChessSound") === "on";
  let timerModule = null;
  let audioContext = null;
  let soundModule = null;
  let shareModule = null;
  let leaderboardModule = null;

  // Shared RGH sound.js is loaded as a module when it exports functions;
  // legacy window-based APIs are also supported through the adapter below.
  const callFirst = (obj, names, ...args) => {
    for (const name of names) {
      if (obj && typeof obj[name] === "function") {
        try { return obj[name](...args); } catch (err) { console.warn(`RGH ${name} failed`, err); }
      }
    }
    return undefined;
  };
  const tapSound = () => {
    if (!soundEnabled) return;
    if (soundModule && typeof soundModule.playSound === "function") {
      soundModule.playSound("click");
      return;
    }
    const globalSound = window.SoundManager || window.soundManager || window.RGHSound || window.sounds;
    for (const name of ["playTap", "playClick", "tap", "click"]) {
      if (soundModule && typeof soundModule[name] === "function") { soundModule[name](); return; }
      if (globalSound && typeof globalSound[name] === "function") { globalSound[name](); return; }
    }
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioContext ||= new AC();
      if (audioContext.state === "suspended") audioContext.resume();
      const osc = audioContext.createOscillator(), gain = audioContext.createGain();
      osc.type = "sine"; osc.frequency.value = 660;
      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.07, audioContext.currentTime + .01);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .09);
      osc.connect(gain); gain.connect(audioContext.destination);
      osc.start(); osc.stop(audioContext.currentTime + .1);
    } catch (_) { /* Optional sound must not stop the game. */ }
  };

  async function loadSharedModules() {
    const load = async path => { try { return await import(path); } catch (e) { console.warn(`Optional module ${path} not loaded:`, e.message); return null; } };
    [soundModule, shareModule, leaderboardModule, timerModule] = await Promise.all([
      load("./sound.js"), load("./share.js"), load("./leaderboard.js"), load("./timer.js")
    ]);
    if (timerModule && typeof timerModule.startTimer === "function") timerModule.startTimer();
    if (soundModule && typeof soundModule.setSoundEnabled === "function") soundModule.setSoundEnabled(soundEnabled);
  }

  const LOCAL_BOARD_KEY = "rghChessLeaderboardV1";
  function readLocalScores() {
    try { return JSON.parse(localStorage.getItem(LOCAL_BOARD_KEY) || "[]"); }
    catch (_) { return []; }
  }
  function saveLocalScore(entry) {
    const rows = readLocalScores();
    rows.push(entry);
    rows.sort((a, b) => b.score - a.score || a.timestamp - b.timestamp);
    localStorage.setItem(LOCAL_BOARD_KEY, JSON.stringify(rows.slice(0, 100)));
    renderLeaderboard();
  }
  async function saveGlobalScore(entry) {
    // Compatible with common RGH leaderboard module exports. Your leaderboard.js
    // must export one of these functions, or expose a matching window API.
    const result = callFirst(leaderboardModule, ["submitScore", "saveScore", "addScore", "submitChessScore"], entry);
    if (result !== undefined) return await result;
    const globalBoard = window.RGHLeaderboard || window.Leaderboard || window.leaderboard;
    const globalResult = callFirst(globalBoard, ["submitScore", "saveScore", "addScore", "submitChessScore"], entry);
    if (globalResult !== undefined) return await globalResult;
    throw new Error("Global leaderboard API not found. Export submitScore(entry) from js/leaderboard.js.");
  }
  async function renderLeaderboard() {
    const box = $("leaderboardList");
    if (!box) return;
    const rows = readLocalScores();
    box.replaceChildren();
    if (!rows.length) { box.textContent = "No local scores yet."; return; }
    rows.slice(0, 10).forEach((row, index) => {
      const item = document.createElement("li");
      item.textContent = `${index + 1}. ${row.name} — ${row.score} (${row.result})`;
      box.append(item);
    });
  }
  function calculateScore() {
    const won = /wins/i.test(game.message) && /checkmate/i.test(game.message);
    const draw = /draw|stalemate/i.test(game.message);
    if (won) return game.message.includes("White wins") ? 100 : (game.computerEnabled ? 0 : 100);
    if (draw) return 50;
    return Math.max(0, game.capturedWhite.reduce((n,p)=>n+({pawn:1,knight:3,bishop:3,rook:5,queen:9}[p.kind]||0),0));
  }
  let resultRecorded = false;
  let resultSoundPlayed = false;
  async function recordFinishedGame() {
    if (!game.gameOver || resultRecorded) return;
    resultRecorded = true;
    if (timerModule && typeof timerModule.stopTimer === "function") timerModule.stopTimer();
    const name = (prompt("Enter your name for the Chess leaderboard:", "Guest") || "Guest").trim().slice(0, 30) || "Guest";
    const result = /checkmate/i.test(game.message) ? game.message : game.message;
    const entry = { name, game: "chess", score: calculateScore(), result, mode: game.computerEnabled ? "computer" : "pvp", difficulty: game.difficulty, timestamp: Date.now() };
    saveLocalScore(entry);
    try {
      await saveGlobalScore(entry);
      const globalStatus = $("globalLeaderboardStatus");
      if (globalStatus) globalStatus.textContent = "Global score submitted.";
    } catch (e) {
      const globalStatus = $("globalLeaderboardStatus");
      if (globalStatus) globalStatus.textContent = "Saved locally; global leaderboard is not connected yet.";
      console.info(e.message);
    }
  }
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
    void recordFinishedGame();
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
    tapSound();
    const enabled=e.target.value==="computer";
    const difficulty=$("levelSelect").value || "Hard";
    game.reset();
    game.computerEnabled=enabled;
    game.difficulty=difficulty;
    game.selected=null;game.legalTargets=[];
    $("levelSelect").hidden=!enabled;
    $("levelLabel").hidden=!enabled;
    resultRecorded=false;
    resultSoundPlayed=false;
    if(timerModule){timerModule.resetTimer();timerModule.startTimer();}
    render();
  });
  $("levelSelect").addEventListener("change",e=>{tapSound();game.difficulty=e.target.value;});
  $("newBtn").addEventListener("click",()=>{tapSound();const enabled=game.computerEnabled,difficulty=game.difficulty;game.reset();game.computerEnabled=enabled;game.difficulty=difficulty;resultRecorded=false;resultSoundPlayed=false;if(timerModule){timerModule.resetTimer();timerModule.startTimer();}render();});
  $("undoBtn").addEventListener("click",()=>{tapSound();game.undoTurn();render();});
  $("deselectBtn").addEventListener("click",()=>{tapSound();game.selected=null;game.legalTargets=[];render();});
  $("soundBtn").textContent=soundEnabled?"♪ Sound On":"♪ Sound Off";
  $("soundBtn").setAttribute("aria-pressed",String(soundEnabled));
  $("soundBtn").addEventListener("click",()=>{soundEnabled=!soundEnabled;localStorage.setItem("rghChessSound",soundEnabled?"on":"off");$("soundBtn").textContent=soundEnabled?"♪ Sound On":"♪ Sound Off";$("soundBtn").setAttribute("aria-pressed",String(soundEnabled));if(soundModule && typeof soundModule.setSoundEnabled === "function") soundModule.setSoundEnabled(soundEnabled);if(soundEnabled)tapSound();});
  const shareBtn = $("shareBtn");
  if (shareBtn) shareBtn.addEventListener("click", async () => {
    tapSound();
    const shareData = { title: "Ravindra Games Hub — Chess", text: "Play Chess at Ravindra Games Hub", url: location.href };
    let shared = callFirst(shareModule, ["shareScore"], "Chess", calculateScore());
    if (shared !== undefined) { try { await shared; } catch (_) {} return; }
    shared = callFirst(shareModule, ["share", "shareContent", "shareUrl", "shareGame"], shareData);
    if (shared !== undefined) { try { await shared; } catch (_) {} return; }
    const globalShare = window.RGHShare || window.ShareManager || window.shareManager;
    shared = callFirst(globalShare, ["share", "shareContent", "shareUrl", "shareGame"], shareData);
    if (shared !== undefined) { try { await shared; } catch (_) {} return; }
    if (navigator.share) { try { await navigator.share(shareData); return; } catch (_) {} }
    try { await navigator.clipboard.writeText(shareData.url); alert("Chess link copied."); }
    catch (_) { prompt("Copy this Chess link:", shareData.url); }
  });
  const refreshLeaderboardBtn = $("refreshLeaderboardBtn");
  if (refreshLeaderboardBtn) refreshLeaderboardBtn.addEventListener("click", () => { tapSound(); void renderLeaderboard(); });
  const themes=["light","dark","blue","orange"];
  let theme=localStorage.getItem("rghChessTheme")||"light";
  if(theme!=="light")document.body.dataset.theme=theme;
  $("themeBtn").addEventListener("click",()=>{tapSound();theme=themes[(themes.indexOf(theme)+1)%themes.length];if(theme==="light")delete document.body.dataset.theme;else document.body.dataset.theme=theme;localStorage.setItem("rghChessTheme",theme);});
  render();
  await loadSharedModules();
  await renderLeaderboard();
});
