import { INITIAL_POSITION, RANKS} from "../constants";
import tileToCode from "./tileToCode";
import codeToTile from "./codeToTile";

function longCastle(snapshot, prevMoves, pieceColor) {
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
            if (indexPrevMove !== -1) return [];
        }

        // There should be no piece in between
        let pieceIndex = snapshot.findIndex(code => code.includes(currCode));
        if (pieceIndex !== -1) return [];
        colKing--;
    }

    const kingFinalPos = tileToCode(row, colKing + 1);
    const kingMove = kingPiece + kingInitialPos + kingFinalPos;

    const rookFinalPos = tileToCode(row, colRook + 2);
    const rookMove = rookPiece + rookInitialPos + rookFinalPos;
    return [[kingMove, rookMove]];
}

function shortCastle(snapshot, prevMoves, pieceColor) {
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
        // There should be no piece in between
        let pieceIndex = snapshot.findIndex(code => code.includes(currCode));
        if (pieceIndex !== -1) return [];

        // King should not move into check
        if (prevMoves) {
            let indexPrevMove = prevMoves.findIndex(prevMove => {
                const destinationCode = prevMove.substring(4,6);
                return destinationCode === currCode;
            })
            if (indexPrevMove !== -1) return [];            
        }   
        colKing++;
    }
    const kingFinalPos = tileToCode(row, colKing - 1);
    const kingMove = kingPiece + kingInitialPos + kingFinalPos;

    const rookFinalPos = tileToCode(row, colRook - 2);
    const rookMove = rookPiece + rookInitialPos + rookFinalPos;

    return [[kingMove, rookMove]];
    
}

export function getCastling(snapshot, pieceColor, prevMoves) {
    if (!snapshot || !pieceColor) return [];
    
    const rookPiece = pieceColor + 'R';
    const rooks = snapshot.filter(code => code.includes(rookPiece));
    const rookFirst = rooks[0] || null;
    const rookSecond = rooks[1] || null;

    let shortCastleMoves = [], longCastleMoves = [];
    if (rookFirst && INITIAL_POSITION[rookPiece].includes(rookFirst.substring(2,4))) {
        if (rookFirst.charAt(2) === 'a') longCastleMoves = longCastle(snapshot, prevMoves, pieceColor);
        else shortCastleMoves = shortCastle(snapshot, prevMoves, pieceColor);
    } 
    if (rookSecond && INITIAL_POSITION[rookPiece].includes(rookSecond.substring(2,4))) {
        if (rookSecond.charAt(2) === 'a') longCastleMoves = longCastle(snapshot, prevMoves, pieceColor);
        else shortCastleMoves = shortCastle(snapshot, prevMoves, pieceColor);
    }
    
    return [...longCastleMoves, ...shortCastleMoves];
}

export function getEnpassant(snapshot, pieceColor, lastMove) {
    if (!snapshot || !pieceColor || !lastMove || lastMove.charAt(1) !== 'P') return [];
    const piece = pieceColor + 'P'
    const pieceCodeArray = snapshot.filter(code => code.includes(piece));
    let moves = [];
    
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode.substring(2);
        const { row } = codeToTile(currCode);
        const dir = pieceColor === 'w' ? -1 : 1;        
        const oppositePiece = lastMove.substring(0, 2);
        const oppositeSourceCode = lastMove.substring(2, 4);
        const oppositeDestinationCode = lastMove.substring(4);

        // Check if on same rank && check if on adjacent files && check if last piece moved from original pos
        // && check if last piece moved double
        if (currCode.charAt(1) !== oppositeDestinationCode.charAt(1) ||
            Math.abs(currCode.charCodeAt(0) - oppositeDestinationCode.charCodeAt(0)) !== 1 ||
            INITIAL_POSITION[oppositePiece].indexOf(oppositeSourceCode) === -1 ||
            Math.abs(oppositeDestinationCode.charAt(1) - oppositeSourceCode.charAt(1)) !== 2) return;
        
        const newRow = row + 1 * dir;
        const newCode = oppositeDestinationCode.charAt(0) + RANKS[newRow];
        const move = piece + currCode + newCode;
        moves.push([move , oppositePiece + oppositeDestinationCode]);
    })
    return moves;
}

export function getPromotion(snapshot, pieceColor) {
    if (!snapshot || !pieceColor) return [];
    const pieceCodeArray = snapshot.filter(code => code.includes(pieceColor + 'P'));
    let moves = [];
    pieceCodeArray.forEach(pieceCode => {
        const currCode = pieceCode.substring(2);
        const { row, col } = codeToTile(currCode);
        const dir = pieceColor === 'w' ? -1 : 1;
        if (!(currCode.charAt(1) === '7' && pieceColor === 'w') && !(currCode.charAt(1) === '2' && pieceColor === 'b')) return;
        let newRow = row + 1 * dir;
        let newCode = tileToCode(newRow, col);
        // Check if pawn can move forward
        if (snapshot.findIndex(code => code.includes(newCode)) === -1) {
            const move = pieceColor + 'P' + currCode + newCode;
            moves.push([move, move]);
        }
        // Logic for capturing with pawn
        const diagonalLeftCode = tileToCode(row + 1 * dir, col - 1);
        if (snapshot.findIndex(code => code.includes(diagonalLeftCode) && code.charAt(0) !== pieceColor) !== -1) {
            const move = pieceColor + 'P' + currCode + diagonalLeftCode;
            moves.push([move, move]);
        }
        const diagonalRightCode = tileToCode(row + 1 * dir, col + 1);
        if (snapshot.findIndex(code => code.includes(diagonalRightCode) && code.charAt(0) !== pieceColor) !== -1) {
            const move = pieceColor + 'P' + currCode + diagonalRightCode;
            moves.push([move, move]);
        }
    });
    return moves;
}