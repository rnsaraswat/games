/* Chess rules and search AI translated from the supplied chess_game.dart.
   Coordinates: row 0 is rank 8, col 0 is file a. */
(() => {
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
      this.computerEnabled = false;
      this.difficulty = "Medium";
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
  window.RGHChess = {ChessGame, SIDE, SYMBOLS};
})();