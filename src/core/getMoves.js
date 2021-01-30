import { MOVEMENTS, INITIAL_POSITION } from "../constants";

import inbound from "./inbound";
import codeToTile from "./codeToTile";
import tileToCode from "./tileToCode";
import isChecked from "./isChecked";
import { getCastling, getEnpassant, getPromotion } from "./specialMoves";

function getGenericMovesFromObj(movementsObj, snapshot, piece) {
    if (!movementsObj || !snapshot || !piece) return [];
    let moves = [];
    const pieceColor = piece.charAt(0);
    
    // Can have multiple queens, rooks, bishop
    const pieceCodeArray = snapshot.filter(code => code.includes(piece));
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode ? pieceCode.substring(2) : "";

        const { row, col } = currCode ? codeToTile(currCode) : "";

        if (row === undefined || col === undefined) return moves;
        for (const movementsDir in movementsObj) {
            const movements = movementsObj[movementsDir];
            movements.every(movement => {
                const x = movement[0];
                const y = movement[1];
                const newRow = row + x;
                const newCol = col + y;
                // Check if new coords are inbound
                if (inbound(newRow, newCol)) {
                    // Get the chess code
                    const newCode = tileToCode(newRow, newCol);
        
                    // Check if space is occupied by same colored piece
                    const indexSameColor = snapshot.findIndex(code => 
                        code.includes(pieceColor) && code.includes(newCode));
                    if (indexSameColor !== -1) return false;
                    const move = piece + currCode + newCode;
                    moves.push(move);
                    if (snapshot.findIndex(code => code.includes(newCode)) !== -1) return false;
                }
                return true;
            })
        }
    });
    return moves;
}

function getGenericMovesFromArray(movements, snapshot, piece, prevMoves = []) {
    if (!movements || !snapshot || !piece) return [];
    let moves = [];
    const pieceColor = piece.charAt(0);
    const pieceType = piece.charAt(1);
    
    const pieceCodeArray = snapshot.filter(code => code.includes(piece));
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode ? pieceCode.substring(2) : "";

        const { row, col } = currCode ? codeToTile(currCode) : "";

        if (row === undefined || col === undefined) return moves;
        
        movements.forEach(movement => {
            let x = movement[0];
            let y = movement[1];
            if (piece === 'wP') x *= -1;
            const newRow = row + x;
            const newCol = col + y;
            // Check if new coords are inbound
            if (inbound(newRow, newCol)) {
                // Get the chess code
                const newCode = tileToCode(newRow, newCol);

                // Check if space is occupied by same colored piece
                const indexSameColor = snapshot.findIndex(code => code.includes(pieceColor) && code.includes(newCode));
                if (indexSameColor !== -1) return;   
                
                // If piece is pawn and snapshot has a piece on the new move or it's promotion move then return
                if (pieceType === 'P' && 
                ((snapshot.findIndex(code => code.includes(newCode)) !== -1) ||
                newCode.charAt(1) === '1' || newCode.charAt(1) === '8'))return;

                const move = piece + currCode + newCode;
                moves.push(move);
            }
        })
    });
    return moves;
}

export function getKingMoves(movements, snapshot, pieceColor, prevMoves) {
    return getGenericMovesFromArray(movements, snapshot, pieceColor + 'K', prevMoves);
}

export function getQueenMoves(movementsObj, snapshot, pieceColor) {
    return getGenericMovesFromObj(movementsObj, snapshot, pieceColor + 'Q');
}

export function getBishopMoves(movementsObj, snapshot, pieceColor) {
    return getGenericMovesFromObj(movementsObj, snapshot, pieceColor + 'B');
}

export function getKnightMoves(movements, snapshot, pieceColor) {
    return getGenericMovesFromArray(movements, snapshot, pieceColor + 'N');
}

export function getRookMoves(movementsObj, snapshot, pieceColor) {
    return getGenericMovesFromObj(movementsObj, snapshot, pieceColor + 'R');
}

export function getPawnMoves(movements, snapshot, pieceColor) {
    // Will take last move to check for enpassant
    const piece = pieceColor + 'P'
    const pieceCodeArray = snapshot.filter(code => code.includes(piece));
    let moves = [];
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode.substring(2);
        const { row, col } = codeToTile(currCode);
        const dir = pieceColor === 'w' ? -1 : 1;
        // console.log(row, col);
        if ((row === 1 && pieceColor === 'w') || (row === 6 && pieceColor === 'b')) return;
        // Logic for double move on first turn of the pawn
        if (INITIAL_POSITION[piece].includes(currCode)) {            
            let newRow = row + 1 * dir;
            let newCode = tileToCode(newRow, col);
            if (snapshot.findIndex(code => code.includes(newCode)) === -1) {
                newRow += 1 * dir;
                newCode = tileToCode(newRow, col);
                const move = piece + currCode + newCode;
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
    moves = [...moves, ...getGenericMovesFromArray(movements, snapshot, piece)];
    
    return moves;
}

export default function getMoves(snapshot, pieceColor, prevMoves, lastMove, checkedByPieces, checkingMoves = [], recursive = true) {
    //args = squares where king is checked from where pieces can move
    let moves = [];
    let specialMoves = [];
    const isKingChecked = checkedByPieces > 0 ? true : false;
    if (checkedByPieces === 2) {
        moves = [...moves, ...getKingMoves(MOVEMENTS['K'], snapshot, pieceColor, checkingMoves)];
    } else {
        for (const pieceType in MOVEMENTS) {
            const movements = MOVEMENTS[pieceType];         
            switch(pieceType) {
                case 'K': {
                    moves = [...moves, ...getKingMoves(movements, snapshot, pieceColor, prevMoves)];
                    let currCode = snapshot.find(code => code.includes(pieceColor + 'K'));
                    currCode = currCode.substring(2, 4);
                    if (!isKingChecked && INITIAL_POSITION[pieceColor + 'K'][0] === currCode) {
                        specialMoves = [...specialMoves, ...getCastling(snapshot, pieceColor, prevMoves)];
                    }
                    break;
                }

                case 'Q': {
                    moves = [...moves, ...getQueenMoves(movements, snapshot, pieceColor)];
                    break;  
                }

                case 'B': {
                    moves = [...moves, ...getBishopMoves(movements, snapshot, pieceColor)];
                    break;
                }
                
                case 'N': {
                    moves = [...moves, ...getKnightMoves(movements, snapshot, pieceColor)];
                    break;
                }

                case 'R': {
                    moves = [...moves, ...getRookMoves(movements, snapshot, pieceColor)];
                    break;
                }

                case 'P': {
                    moves = [...moves, ...getPawnMoves(movements, snapshot, pieceColor)];
                    
                    specialMoves = [...specialMoves, ...getEnpassant(snapshot, pieceColor, lastMove), ...getPromotion(snapshot, pieceColor)];
                    break;
                }
                default: return moves;
            }
        }
    }
    if (specialMoves.length > 0) {
        for (let i = 0; i < specialMoves.length; i++) {
            const move = specialMoves[i][0];
            moves.push(move);
        }
    }

    if (recursive) {
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