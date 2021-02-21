import { MOVEMENTS, INITIAL_POSITION } from "../constants";

import inbound from "./inbound";
import codeToTile from "./codeToTile";
import tileToCode from "./tileToCode";
import isChecked from "./isChecked";
import { getCastling, getEnpassant, getPromotion } from "./specialMoves";

export function getPieceMoves(movements, snapshot, piece) {
    if (!movements || !snapshot || !piece) return [];
    let moves = [];
    const pieceColor = piece.charAt(0);
    
    // Can have multiple queens, rooks, bishop
    const pieceCodeArray = snapshot.filter(code => code.includes(piece));
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode ? pieceCode.substring(2) : "";

        const { row, col } = currCode ? codeToTile(currCode) : "";

        if (row === undefined || col === undefined) return moves;
        movements.forEach(movementsDir => {
            let index = 0;
            while(index < movementsDir.length) {
                const movement = movementsDir[index++];
                const x = movement[0];
                const y = movement[1];
                const newRow = row + x;
                const newCol = col + y;

                // Check if new coords are inbound
                if (!inbound(newRow, newCol)) break;
                
                // Get the chess code
                const newCode = tileToCode(newRow, newCol);
                
                // Check if space is occupied by same colored piece
                const indexSameColor = snapshot.findIndex(code => 
                    code.charAt(0) === pieceColor && code.includes(newCode));
                if (indexSameColor !== -1) break;

                // Add move
                const move = piece + currCode + newCode;
                moves.push(move);

                // If it's a capture move break
                if (snapshot.findIndex(code => code.includes(newCode)) !== -1) break;
            }
        })
    });
    return moves;
}

export function getPawnMoves(snapshot, pieceColor) {
    const piece = pieceColor + 'P'
    const pieceCodeArray = snapshot.filter(code => code.includes(piece));
    let moves = [];
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode.substring(2);
        const { row, col } = codeToTile(currCode);
        const dir = pieceColor === 'w' ? -1 : 1;

        // Promotion squares are treated differently
        if ((row === 1 && pieceColor === 'w') || (row === 6 && pieceColor === 'b')) return;
        
        let newRow = row + 1 * dir;
        let newCode = tileToCode(newRow, col);
        // If pawn can move forward
        if (snapshot.findIndex(code => code.includes(newCode)) === -1) {
            let move = piece + currCode + newCode;
            moves.push(move);
            // Logic for double move on first turn of the pawn       
            if (INITIAL_POSITION[piece].includes(currCode)) {     
                newRow += 1 * dir;
                newCode = tileToCode(newRow, col);
                move = piece + currCode + newCode;
                // If pawn can move forward
                if (snapshot.findIndex(code => code.includes(newCode)) === -1) moves.push(move);
            }
        }

        // Logic for capturing with pawn
        const diagonalLeftCode = tileToCode(row + 1 * dir, col - 1);
        if (snapshot.findIndex(code => code.includes(diagonalLeftCode) && code.charAt(0) !== pieceColor) !== -1) {
            const move = piece + currCode + diagonalLeftCode;
            moves.push(move);
        }
        const diagonalRightCode = tileToCode(row + 1 * dir, col + 1);
        if (snapshot.findIndex(code => code.includes(diagonalRightCode) && code.charAt(0) !== pieceColor) !== -1) {
            const move = piece + currCode + diagonalRightCode;
            moves.push(move);
        }
    })
    
    return moves;
}

export default function getMoves(snapshot, pieceColor, prevMoves, lastMove, checkedByPieces, hasKingMoved = false, getLegalMoves = true) {
    let moves = [];
    let specialMoves = [];
    const isKingChecked = checkedByPieces > 0 ? true : false;
    if (checkedByPieces === 2) {
        moves = [...moves, ...getPieceMoves(MOVEMENTS['K'], snapshot, pieceColor + 'K')];
    } else {        
        moves = [...moves, ...getPieceMoves(MOVEMENTS['K'], snapshot, pieceColor + 'K')];
        if (!isKingChecked && !hasKingMoved) {
            const castlingMoves = getCastling(snapshot, pieceColor, prevMoves);
            if (castlingMoves.length > 0) {
                specialMoves = [...specialMoves, ...castlingMoves]
            }
        }
        
        if (snapshot.findIndex(code => code.includes(pieceColor + 'Q')) !== -1) {
            moves = [...moves, ...getPieceMoves(MOVEMENTS['Q'], snapshot, pieceColor + 'Q')];        
        }

        if (snapshot.findIndex(code => code.includes(pieceColor + 'B')) !== -1) {
            moves = [...moves, ...getPieceMoves(MOVEMENTS['B'], snapshot, pieceColor + 'B')];
        }

        if (snapshot.findIndex(code => code.includes(pieceColor + 'N')) !== -1) {
            moves = [...moves, ...getPieceMoves(MOVEMENTS['N'], snapshot, pieceColor + 'N')];
        }

        if (snapshot.findIndex(code => code.includes(pieceColor + 'R')) !== -1) {
            moves = [...moves, ...getPieceMoves(MOVEMENTS['R'], snapshot, pieceColor + 'R')];
        }
        
        if (snapshot.findIndex(code => code.includes(pieceColor + 'P')) !== -1) {
            moves = [...moves, ...getPawnMoves(snapshot, pieceColor)];
            const enpassantMoves = getEnpassant(snapshot, pieceColor, lastMove);
            if (enpassantMoves.length > 0)
                specialMoves = [...specialMoves, ...enpassantMoves]
            const promotionMoves = getPromotion(snapshot, pieceColor);
            if (promotionMoves.length > 0)
                specialMoves = [...specialMoves, ...promotionMoves];
        }
    }
    
    if (specialMoves.length > 0) specialMoves.forEach( move => moves.push(move[0]))

    if (getLegalMoves) {
        moves = moves.filter(move => {
            const newSnapshot = [...snapshot];
            const selected = move.substring(0, 4);
            const newMove = move.substring(4);
            let pieceIndex = newSnapshot.findIndex(code => code.includes(newMove));
            if (pieceIndex !== -1) {
                newSnapshot.splice(pieceIndex, 1);
            }
            pieceIndex = newSnapshot.indexOf(selected);
            newSnapshot.splice(pieceIndex, 1);
            const piece = selected.substring(0, 2);
            newSnapshot.push(piece + newMove);
            const newTurn = pieceColor === 'w' ? 'b' : 'w';
            const { firstCheckingPiece } = isChecked(newSnapshot, newTurn);
            return firstCheckingPiece === '';
        });
    }

    return { moves, specialMoves };
}