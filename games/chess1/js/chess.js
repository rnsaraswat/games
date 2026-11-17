/* 
   चेस के नियम और सर्च AI इंजन कोड (साउंड इफेक्ट्स के साथ)
   Coordinates: row 0 is rank 8, col 0 is file a. 
*/

// 1. sound.js से साउंड फंक्शन को इम्पोर्ट किया गया
import { playSound } from './sound.js';

(() => {
    "use strict";

    const SIDE = { WHITE: "white", BLACK: "black" };
    const PIECE_ORDER = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    const SYMBOLS = {
        white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" },
        black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" }
    };
    const PIECE_VALUES = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100 };
    const getOppositeSide = (side) => side === SIDE.WHITE ? SIDE.BLACK : SIDE.WHITE;
    const createPiece = (kind, side) => ({ kind, side, symbol: SYMBOLS[side][kind] });
    const getSquareName = (row, col) => `${String.fromCharCode(97 + col)}${8 - row}`;
    const cloneBoard = (board) => board.map(row => row.map(p => p ? { ...p } : null));

    class ChessGame {
        constructor() {
            this.computerEnabled = true;
            this.difficulty = "Hard";
            this.reset();
        }

        reset() {
            this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
            for (let col = 0; col < 8; col++) {
                this.board[0][col] = createPiece(PIECE_ORDER[col], SIDE.BLACK);
                this.board[1][col] = createPiece("pawn", SIDE.BLACK);
                this.board[6][col] = createPiece("pawn", SIDE.WHITE);
                this.board[7][col] = createPiece(PIECE_ORDER[col], SIDE.WHITE);
            }
            this.turn = SIDE.WHITE; this.selected = null; this.legalTargets = [];
            this.message = "White's turn"; this.gameOver = false; this.moves = 0;
            this.moveHistory = []; this.capturedWhite = []; this.capturedBlack = [];
            this.undoStack = [];
            this.rights = { whiteKing: false, blackKing: false, whiteA: false, whiteH: false, blackA: false, blackH: false };
            this.ep = null;
        }

        isInsideBoard(row, col) { return row >= 0 && row < 8 && col >= 0 && col < 8; }
        isSameSide(pieceA, pieceB) { return !!pieceA && !!pieceB && pieceA.side === pieceB.side; }

        // खिलाड़ी द्वारा स्क्रीन टच करने का फंक्शन
        tap(row, col) {
            if (this.gameOver || (this.computerEnabled && this.turn === SIDE.BLACK)) return false;

            // स्थिति A: खिलाड़ी ने पहले मोहरा चुना था और अब एक वैध (Legal) खाने पर क्लिक किया -> सही चाल
            if (this.selected && this.legalTargets.some(([r, c]) => r === row && c === col)) {
                // सही चाल चलने पर 'click' साउंड प्ले होगी (makeMove के अंदर भी कॉल है, या यहाँ रख सकते हैं)
                playSound('click');
                this.makeMove(this.selected[0], this.selected[1], row, col);
                this.selected = null; this.legalTargets = []; this.updateStatus();
                return true;
            }

            const piece = this.board[row][col];

            // स्थिति B: खिलाड़ी ने अपनी ही टीम का मोहरा सिलेक्ट किया
            if (piece && piece.side === this.turn) {
                this.selected = [row, col];
                this.legalTargets = this.legalMoves(row, col);
                playSound('click'); // मोहरा चुनने पर भी 'click' साउंड
            }
            // स्थिति C: खिलाड़ी ने गलत चाल चली या खाली जगह/दुश्मन पर गलत क्लिक किया
            else {
                this.selected = null;
                this.legalTargets = [];
                playSound('error'); // 2. गलत जगह क्लिक करने या अवैध चाल की कोशिश पर 'error' साउंड
            }
            return false;
        }

        setComputerEnabled(enabled) {
            this.computerEnabled = enabled;
            if (enabled && this.turn === SIDE.BLACK && !this.gameOver) this.playComputerMove();
        }

        allLegalMoves(side) {
            const movesList = [];
            for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (this.board[r][c]?.side === side)
                for (const [tr, tc] of this.legalMoves(r, c)) movesList.push([r, c, tr, tc]);
            return movesList;
        }

        playComputerMove() {
            if (!this.computerEnabled || this.turn !== SIDE.BLACK || this.gameOver) return false;
            const depth = this.difficulty === "Easy" ? 1 : this.difficulty === "Hard" ? 3 : 2;
            const moves = this.allLegalMoves(SIDE.BLACK);
            if (!moves.length) { this.updateStatus(); return false; }
            let bestMove = null, bestScore = -1e8;
            for (const m of moves) {
                const snapshot = this.snapshot(); this.apply(...m);
                const score = -this.search(depth - 1, -1e8, 1e8, SIDE.WHITE); this.restore(snapshot);
                const jitter = this.difficulty === "Easy" ? ((m[0] * 13 + m[1] * 7 + moves.length) % 9) : 0;
                if (score + jitter > bestScore) { bestScore = score + jitter; bestMove = m; }
            }
            if (!bestMove) { this.updateStatus(); return false; }

            // कंप्यूटर द्वारा चाल चलने पर 'click' साउंड
            playSound('click');
            this.makeMove(...bestMove); this.selected = null; this.legalTargets = []; this.updateStatus();
            return true;
        }

        search(depth, alpha, beta, side) {
            if (depth <= 0) return this.evaluate(side);
            const moves = this.allLegalMoves(side);
            if (!moves.length) return this.inCheck(side) ? -90000 - depth : 0;
            let bestScore = -1e8;
            for (const m of moves) {
                const snapshot = this.snapshot(); this.apply(...m);
                const score = -this.search(depth - 1, -beta, -alpha, getOppositeSide(side)); this.restore(snapshot);
                if (score > bestScore) bestScore = score; if (score > alpha) alpha = score; if (alpha >= beta) break;
            }
            return bestScore;
        }

        evaluate(perspective) {
            let totalScore = 0;
            for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c]; if (!piece) continue;
                let pieceScore = PIECE_VALUES[piece.kind] * 100 + Math.round((3.5 - Math.abs(c - 3.5)) * 4);
                if (piece.kind === "pawn") pieceScore += (piece.side === SIDE.WHITE ? 6 - r : r - 1) * 3;
                totalScore += piece.side === perspective ? pieceScore : -pieceScore;
            }
            return totalScore;
        }

        snapshot() { return { board: cloneBoard(this.board), turn: this.turn, moves: this.moves, rights: { ...this.rights }, ep: this.ep ? { ...this.ep } : null }; }
        restore(snap) { this.board = cloneBoard(snap.board); this.turn = snap.turn; this.moves = snap.moves; this.rights = { ...snap.rights }; this.ep = snap.ep ? { ...snap.ep } : null; }

        makeMove(fromRow, fromCol, toRow, toCol) {
            const piece = this.board[fromRow][fromCol]; let captured = this.board[toRow][toCol];
            if (piece.kind === "pawn" && fromCol !== toCol && !captured && this.ep && toRow === this.ep.r && toCol === this.ep.c) captured = this.board[fromRow][toCol];
            this.undoStack.push({ snapshot: this.snapshot(), historyLength: this.moveHistory.length });
            const notation = `${piece.symbol}${getSquareName(fromRow, fromCol)}${captured ? "x" : "-"}${getSquareName(toRow, toCol)}${piece.kind === "king" && Math.abs(toCol - fromCol) === 2 ? " (castling)" : ""}`;
            this.apply(fromRow, fromCol, toRow, toCol);
            if (captured) { if (captured.side === SIDE.WHITE) this.capturedWhite.push(captured); else this.capturedBlack.push(captured); }
            this.moveHistory.push({ notation, side: piece.side, captured });
        }

        undoMove() {
            if (!this.undoStack.length) return false;
            const item = this.undoStack.pop(); this.restore(item.snapshot);
            this.moveHistory.length = item.historyLength;
            this.capturedWhite = []; this.capturedBlack = [];
            for (const rec of this.moveHistory) if (rec.captured) { (rec.captured.side === SIDE.WHITE ? this.capturedWhite : this.capturedBlack).push(rec.captured); }
            this.selected = null; this.legalTargets = []; this.gameOver = false; this.updateStatus(); return true;
        }

        undoTurn() {
            if (this.computerEnabled) { if (this.turn === SIDE.WHITE && this.undoStack.length) this.undoMove(); if (this.undoStack.length) this.undoMove(); }
            else this.undoMove();
        }

        apply(fromRow, fromCol, toRow, toCol) {
            const piece = this.board[fromRow][fromCol], oldEp = this.ep; this.ep = null;
            if (piece.kind === "pawn" && fromCol !== toCol && !this.board[toRow][toCol] && oldEp && toRow === oldEp.r && toCol === oldEp.c) this.board[fromRow][toCol] = null;
            if (piece.kind === "king" && Math.abs(toCol - fromCol) === 2) {
                if (toCol === 6) { this.board[toRow][5] = this.board[toRow][7]; this.board[toRow][7] = null; }
                else { this.board[toRow][3] = this.board[toRow][0]; this.board[toRow][0] = null; }
            }
            this.board[toRow][toCol] = piece; this.board[fromRow][fromCol] = null;
            if (piece.kind === "pawn" && Math.abs(toRow - fromRow) === 2) this.ep = { r: (toRow + fromRow) / 2, c: fromCol };
            if (piece.kind === "pawn" && (toRow === 0 || toRow === 7)) this.board[toRow][toCol] = createPiece("queen", piece.side);
            if (piece.kind === "king") this.rights[piece.side + "King"] = true;
            if (piece.kind === "rook") {
                if (fromRow === 7 && fromCol === 0) this.rights.whiteA = true; if (fromRow === 7 && fromCol === 7) this.rights.whiteH = true;
                if (fromRow === 0 && fromCol === 0) this.rights.blackA = true; if (fromRow === 0 && fromCol === 7) this.rights.blackH = true;
            }
            if (toRow === 7 && toCol === 0) this.rights.whiteA = true; if (toRow === 7 && toCol === 7) this.rights.whiteH = true;
            if (toRow === 0 && toCol === 0) this.rights.blackA = true; if (toRow === 0 && toCol === 7) this.rights.blackH = true;
            this.turn = getOppositeSide(this.turn); this.moves++;
        }

        legalMoves(row, col) {
            const piece = this.board[row][col]; if (!piece) return [];
            const out = [];
            for (let toRow = 0; toRow < 8; toRow++) for (let toCol = 0; toCol < 8; toCol++) {
                if (!this.isPseudoLegal(row, col, toRow, toCol)) continue;
                const snapshot = this.snapshot(); this.apply(row, col, toRow, toCol); const safe = !this.inCheck(piece.side); this.restore(snapshot);
                if (safe) out.push([toRow, toCol]);
            }
            return out;
        }
        isPseudoLegal(fromRow, fromCol, toRow, toCol) {
            if (!this.isInsideBoard(toRow, toCol) || (fromRow === toRow && fromCol === toCol)) return false;
            const piece = this.board[fromRow][fromCol]; if (!piece || this.isSameSide(piece, this.board[toRow][toCol]) || this.board[toRow][toCol]?.kind === "king") return false;
            const diffRow = toRow - fromRow, diffCol = toCol - fromCol, absRow = Math.abs(diffRow), absCol = Math.abs(diffCol);
            switch (piece.kind) {
                case "pawn": {
                    const direction = piece.side === SIDE.WHITE ? -1 : 1, startRow = piece.side === SIDE.WHITE ? 6 : 1;
                    if (diffCol === 0 && !this.board[toRow][toCol] && diffRow === direction) return true;
                    if (diffCol === 0 && !this.board[toRow][toCol] && fromRow === startRow && diffRow === 2 * direction && !this.board[fromRow + direction][fromCol]) return true;
                    if (absCol === 1 && diffRow === direction && this.board[toRow][toCol]) return true;
                    return absCol === 1 && diffRow === direction && this.ep && toRow === this.ep.r && toCol === this.ep.c && this.board[fromRow][toCol]?.kind === "pawn" && this.board[fromRow][toCol]?.side !== piece.side;
                }
                case "knight": return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
                case "king": {
                    if (absRow <= 1 && absCol <= 1) return true;
                    if (diffRow !== 0 || absCol !== 2 || this.inCheck(piece.side)) return false;
                    const homeRow = piece.side === SIDE.WHITE ? 7 : 0;
                    if (fromRow !== homeRow || fromCol !== 4 || this.rights[piece.side + "King"]) return false;
                    if (toCol === 6) {
                        if (this.rights[piece.side + "H"] || this.board[homeRow][7]?.kind !== "rook" || this.board[homeRow][7]?.side !== piece.side || this.board[homeRow][5] || this.board[homeRow][6]) return false;
                        return !this.isSquareAttacked(homeRow, 5, piece.side) && !this.isSquareAttacked(homeRow, 6, piece.side);
                    }
                    if (toCol === 2) {
                        if (this.rights[piece.side + "A"] || this.board[homeRow][0]?.kind !== "rook" || this.board[homeRow][0]?.side !== piece.side || this.board[homeRow][1] || this.board[homeRow][2] || this.board[homeRow][3]) return false;
                        return !this.isSquareAttacked(homeRow, 3, piece.side) && !this.isSquareAttacked(homeRow, 2, piece.side);
                    }
                    return false;
                }
                case "rook": if (diffRow !== 0 && diffCol !== 0) return false; return this.isPathClear(fromRow, fromCol, toRow, toCol);
                case "bishop": if (absRow !== absCol) return false; return this.isPathClear(fromRow, fromCol, toRow, toCol);
                case "queen": if (!(diffRow === 0 || diffCol === 0 || absRow === absCol)) return false; return this.isPathClear(fromRow, fromCol, toRow, toCol);
            }
            return false;
        }
        isPathClear(fromRow, fromCol, toRow, toCol) {
            const stepRow = Math.sign(toRow - fromRow), stepCol = Math.sign(toCol - fromCol); let r = fromRow + stepRow, c = fromCol + stepCol;
            while (r !== toRow || c !== toCol) { if (this.board[r][c]) return false; r += stepRow; c += stepCol; } return true;
        }
        isSquareAttacked(row, col, defendedSide) {
            for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
                const piece = this.board[r][c]; if (piece && piece.side !== defendedSide && this.checkAttackFormula(r, c, row, col)) return true;
            } return false;
        }
        inCheck(side) {
            let kingRow = -1, kingCol = -1;
            for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const piece = this.board[r][c]; if (piece?.kind === "king" && piece.side === side) { kingRow = r; kingCol = c; } }
            if (kingRow < 0) return true; return this.isSquareAttacked(kingRow, kingCol, side);
        }
        checkAttackFormula(fromRow, fromCol, toRow, toCol) {
            const piece = this.board[fromRow][fromCol], diffRow = toRow - fromRow, diffCol = toCol - fromCol, absRow = Math.abs(diffRow), absCol = Math.abs(diffCol);
            switch (piece.kind) {
                case "pawn": return diffRow === (piece.side === SIDE.WHITE ? -1 : 1) && absCol === 1;
                case "knight": return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
                case "king": return absRow <= 1 && absCol <= 1;
                case "rook": return (diffRow === 0 || diffCol === 0) && this.isPathClear(fromRow, fromCol, toRow, toCol);
                case "bishop": return absRow === absCol && this.isPathClear(fromRow, fromCol, toRow, toCol);
                case "queen": return (diffRow === 0 || diffCol === 0 || absRow === absCol) && this.isPathClear(fromRow, fromCol, toRow, toCol);
            } return false;
        }
        hasAnyMove(side) { for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) if (this.board[r][c]?.side === side && this.legalMoves(r, c).length) return true; return false; }
        // गेम का स्टेटस और जीत-हार की साउंड का मैनेजमेंट
        updateStatus() {
            const isPlayerInCheck = this.inCheck(this.turn);
            // यदि किसी खिलाड़ी के पास कोई वैध चाल नहीं बची (खेल समाप्त)
            if (!this.hasAnyMove(this.turn)) {
                this.gameOver = true;
                if (isPlayerInCheck) {
                    // शहमात (Checkmate) की स्थिति
                    this.message = Checkmate! ${ this.turn === SIDE.WHITE ? "Black" : "White" } wins.;
                    // साउंड चेक: यदि कंप्यूटर ऑन है, तो यह तय करेगा कि यूजर जीता या हारा
                    if (this.computerEnabled) {
                        // कंप्यूटर ब्लैक है। अगर टर्न वाइट का है और वो मात हो गया, मतलब यूजर हार गया ('lose')
                        // अगर टर्न ब्लैक का है और कंप्यूटर मात हो गया, मतलब यूजर जीत गया ('win')
                        if (this.turn === SIDE.WHITE) {
                            playSound('lose'); // 3. यूजर हार गया
                        } else {
                            playSound('win');  // 4. यूजर जीत गया
                        }
                    } else {
                        // कंप्यूटर बंद होने पर (2-प्लेयर मोड) सिर्फ सामान्य 'win' प्ले करें
                        playSound('win');
                    }
                } else {
                    // गतिरोध (Stalemate) - मैच ड्रा होने पर कोई विशिष्ट टोन या शांत रख सकते हैं
                    this.message = "Draw — stalemate.";
                }
            } else {
                // खेल अभी जारी है
                this.message = isPlayerInCheck
                    ? ${ this.turn === "white" ? "White" : "Black" } is in check!
: ${ this.turn === "white" ? "White" : "Black" } 's turn;
            }
        }
    }
    window.RGHChess = { ChessGame, SIDE, SYMBOLS };
})();