import getMoves, {getBishopMoves, getQueenMoves, getKnightMoves, getRookMoves, getPawnMoves} from "./getMoves";
import { MOVEMENTS, PIECE_CODE_TO_NAME, MOVEMENT_TYPE, RANKS } from "../constants";

import codeToTile from "./codeToTile";
import tileToCode from "./tileToCode";
// Take last move & new snapshot:
export default function isChecked(newSnapshot, turn) {
    let firstCheckingPiece = '', secondCheckingPiece = '';
    const oldPieceColor = turn;
    const pieceColor = oldPieceColor === 'w' ? 'b' : 'w';
    const kingCode = newSnapshot.find(code => code.includes(pieceColor + 'K')).substring(2);
    const { moves : movesPossibleWithNewSnapshot } = getMoves(newSnapshot, oldPieceColor, [], '', false, [], false);
    movesPossibleWithNewSnapshot.forEach(move => {
        const moveDestinationCode = move.substring(4);
        if (moveDestinationCode === kingCode) {
            if (!firstCheckingPiece) firstCheckingPiece = move.substring(0, 4);
            else if (!secondCheckingPiece) secondCheckingPiece = move.substring(0, 4);
        }
    });
    return {firstCheckingPiece, secondCheckingPiece};
}

const functions = {
    getBishopMoves,
    getQueenMoves,
    getKnightMoves,
    getRookMoves,
    getPawnMoves
}

export function getCheckingMoves(newSnapshot, checkedBy) {
    const checkingColor = checkedBy.charAt(0);
    const checkedColor = checkingColor === 'w' ? 'b' : 'w';
    const checkingPieceType = checkedBy.charAt(1);
    const movementType = MOVEMENT_TYPE[checkingPieceType] || [];
    const funcName = "get" + PIECE_CODE_TO_NAME[checkingPieceType] + "Moves";
    const movements = MOVEMENTS[checkingPieceType];
    if (movementType.includes('single')) {
        const moves = [...functions[funcName](movements, newSnapshot, checkingColor), checkedBy + checkedBy.substring(2)];
        return moves.filter(move => move.includes(checkedColor + 'K'));
    } else {
        const kingCode = newSnapshot.find(code => code.includes(checkedColor + 'K'));
        let file = kingCode.charAt(2);
        let rank = kingCode.charAt(3);
        let moves = [checkedBy + checkedBy.substring(2), checkedBy + file + rank];
        if (movementType.includes('straight') && (file === checkedBy.charAt(2) || rank === checkedBy.charAt(3))) {
            if (file === checkedBy.charAt(2)) {
                RANKS.forEach( checkedRank => {
                    const code = file + checkedRank;
                    moves.push(checkedBy + code);
                })
            } else {
                let startFile = file.charCodeAt(0) - checkedBy.charCodeAt(2) > 0 ? checkedBy.charCodeAt(2) : file.charCodeAt(0);
                let endFile = file.charCodeAt(0) - checkedBy.charCodeAt(2) > 0 ? file.charCodeAt(0) : checkedBy.charCodeAt(2);
                startFile++;
                while(startFile < endFile) {
                    const code = String.fromCharCode(startFile) + rank;                    
                    moves.push(checkedBy + code);
                    startFile++;
                }
            }
        } else if (movementType.includes('diagonal')) {
            let {row : kingRow, col : kingCol} = codeToTile(kingCode.substring(2));
            let {row, col} = codeToTile(checkedBy.substring(2));
            let rowDir = 1;
            let colDir = 1;
            if (kingRow < row) {
                rowDir = -1;
            }
            if (kingCol < col) {
                colDir = -1;
            }
            row += rowDir;
            col += colDir;
            while(row !== kingRow && col !== kingCol) {
                const code = tileToCode(row, col);
                moves.push(checkedBy + code);
                row += rowDir;
                col += colDir;
            }
        }
        return moves;
    }
}