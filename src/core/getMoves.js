import {RANKS, FILES, MOVEMENTS, INITIAL_POSITION, SPECIAL_MOVEMENTS } from "../constants";

function getGenericMovesFromObj(movementsObj, snapshot, piece) {
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

                // Check if king can move to the new space without getting checked
                if (pieceType === 'K') {
                    const indexDiffColor = prevMoves.findIndex(code => {
                        return code.charAt(code.length - 2) === newCode.charAt(0) && 
                        code.charAt(code.length - 1) === newCode.charAt(1);
                    });

                    // If space is occupied by same colored piece or king gets checked return
                    if ((indexSameColor !== -1) || (prevMoves && indexDiffColor !== -1)) return;
                } else if (indexSameColor !== -1) return;   

                const move = piece + currCode + newCode;
                if (pieceType === 'P' && snapshot.findIndex(code => code.includes(newCode)) !== -1) return;
                
                moves.push(move);
            }
        })
    });
    return moves;
}

function longCastle(snapshot, prevMoves, pieceColor) {
    let moves = [];
    const kingPiece = pieceColor + 'K';
    const rookPiece = pieceColor + 'R';
    const kingInitialPos = INITIAL_POSITION[kingPiece][0];
    const rookInitialPos = INITIAL_POSITION[rookPiece][0];
    const kingTilePos = codeToTile(kingInitialPos);
    const rookTilePos = codeToTile(rookInitialPos);
    const row = kingTilePos["row"];
    let colKing = kingTilePos["col"];
    let colRook = rookTilePos["col"];
    
    colKing--;
    colRook++;
    while(colKing > colRook) {
        const currCode = tileToCode(row, colKing);
        // King should not move into check
        if (prevMoves) {
            let indexPrevMove = prevMoves.findIndex(prevMove => {
                const destinationCode = prevMove.substring(4,6);
                return destinationCode === currCode
            })
            if (indexPrevMove !== -1) return moves;            
        }

        // There should be no piece in between
        let pieceIndex = snapshot.findIndex(code => code.includes(currCode));
        if (pieceIndex !== -1) return moves;
        colKing++;
    }

    moves.push(SPECIAL_MOVEMENTS["longCastle"]);
    
    return moves;
}

// Only call if king is not checked
function shortCastle(snapshot, prevMoves, pieceColor) {
    let moves = [];
    const kingPiece = pieceColor + 'K';
    const rookPiece = pieceColor + 'R';
    const kingInitialPos = INITIAL_POSITION[kingPiece][0];
    const rookInitialPos = INITIAL_POSITION[rookPiece][1];
    const kingTilePos = codeToTile(kingInitialPos);
    const rookTilePos = codeToTile(rookInitialPos);
    const row = kingTilePos["row"];
    let colKing = kingTilePos["col"];
    const colRook = rookTilePos["col"];
    
    colKing++;
    while(colKing < colRook) {
        const currCode = tileToCode(row, colKing);
        // King should not move into check
        if (prevMoves) {
            let indexPrevMove = prevMoves.findIndex(prevMove => {
                const destinationCode = prevMove.substring(4,6);
                return destinationCode === currCode;
            })
            if (indexPrevMove !== -1) return moves;            
        }   

        // There should be no piece in between
        let pieceIndex = snapshot.findIndex(code => code.includes(currCode));
        if (pieceIndex !== -1) return moves;
        colKing++;
    }

    moves.push(SPECIAL_MOVEMENTS["shortCastle"]);
    
    return moves;
}

function getCastlingMoves(snapshot, prevMoves, pieceColor) {
    let moves = []
    const piece = pieceColor + 'K';
    const currCode = snapshot.find(code => code.includes(piece)).substring(2, 4);
    if (INITIAL_POSITION[piece][0] === currCode) {
        const rookPiece = pieceColor + 'R';
        const rooks = snapshot.filter(code => code.includes(rookPiece));
        const rookFirst = rooks[0];
        const rookSecond = rooks[1];
        if (INITIAL_POSITION[rookPiece].includes(rookFirst.substring(2,4))) {
            if (rookFirst.charAt(2) === 'a') moves = [...moves, ...shortCastle(snapshot, prevMoves, pieceColor)];
            else if (rookFirst.charAt(2) === 'h') moves = [...moves, ...longCastle(snapshot, prevMoves, pieceColor)];
        } 
        if (INITIAL_POSITION[rookPiece].includes(rookSecond.substring(2,4))) {
            if (rookSecond.charAt(2) === 'a') moves = [...moves, ...shortCastle(snapshot, prevMoves, pieceColor)];
            else if (rookSecond.charAt(2) === 'h') moves = [...moves, ...longCastle(snapshot, prevMoves, pieceColor)];
        }
    }
    return moves;
}


function getKingMoves(movements, snapshot, pieceColor, prevMoves) {
    return getGenericMovesFromArray(movements, snapshot, pieceColor + 'K', prevMoves);
}

function getQueenMoves(movementsObj, snapshot, pieceColor) {
    return getGenericMovesFromObj(movementsObj, snapshot, pieceColor + 'Q');
}

function getBishopMoves(movementsObj, snapshot, pieceColor) {
    return getGenericMovesFromObj(movementsObj, snapshot, pieceColor + 'B');
}

function getKnightMoves(movements, snapshot, pieceColor) {
    return getGenericMovesFromArray(movements, snapshot, pieceColor + 'N');
}

function getRookMoves(movementsObj, snapshot, pieceColor) {
    return getGenericMovesFromObj(movementsObj, snapshot, pieceColor + 'R');
}

function getPawnMoves(movements, snapshot, pieceColor, lastMove) {
    // Will take last move to check for enpassant
    const piece = pieceColor + 'P'
    const pieceCodeArray = snapshot.filter(code => code.includes(piece));
    let moves = [];
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode.substring(2);
        const { row, col } = codeToTile(currCode);
        const dir = pieceColor === 'w' ? -1 : 1;
        if (INITIAL_POSITION[piece].includes(currCode)) {            
            const newRow = row + 2 * dir;
            const newCode = tileToCode(newRow, col);
            const move = piece + currCode + newCode;
            if (snapshot.findIndex(code => code.includes(newCode)) === -1) moves.push(move);
        }
        if (lastMove && lastMove.charAt(1) === 'P') {
            const oppositePiece = lastMove.substring(0, 2);
            const oppositeSourceCode = lastMove.substring(2, 4);
            const oppositeDestinationCode = lastMove.substring(4);
            if (currCode.charAt(1) === oppositeDestinationCode.charAt(1) && 
                Math.abs(currCode.charCodeAt(0) - oppositeDestinationCode.charCodeAt(0)) === 1 && 
                INITIAL_POSITION[oppositePiece].indexOf(oppositeSourceCode) !== -1 && 
                Math.abs(oppositeDestinationCode.charAt(1) - oppositeSourceCode.charAt(1)) === 2) {
                const newRow = row + 1 * dir;
                const newCode = oppositeDestinationCode.charAt(0) + RANKS[newRow];
                const move = piece + currCode + newCode;
                moves.push(move);
            }
        }
    })
    moves = [...moves, ...getGenericMovesFromArray(movements, snapshot, piece)];
    
    return moves;
}

function inbound(row, col) {
    return row >= 0 && col >= 0 && row < 8 && col < 8;
}

function tileToCode(row, col) {
    const rank = RANKS[row];
    const file = FILES[col];
    return file+rank;
}

function codeToTile(code) {    
    const row = 8 - code.charAt(1);
    const col = code.charCodeAt(0) - 97;
    return {row, col}
}

export default function getMoves(snapshot, pieceColor, prevMoves, lastMove, isChecked, args = []) {
    //args = squares where king is checked from where pieces can move
    let moves = [];
    let speicalMoves = [];
    
    for (const pieceType in MOVEMENTS) {
        const movements = MOVEMENTS[pieceType];
        switch(pieceType) {
            case 'K': {
                moves = [...moves, ...getKingMoves(movements, snapshot, pieceColor, prevMoves)];
                if (!isChecked) speicalMoves = [...speicalMoves, ...getCastlingMoves(snapshot, prevMoves, pieceColor)]
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
                moves = [...moves, ...getPawnMoves(movements, snapshot, pieceColor, lastMove)];
                break;
            }
            default: return moves;
        }
    }

    if (isChecked) {
        const { squaresChecked } = args;
        moves = moves.filter(move => squaresChecked.includes(move));
    }

    return moves;
}