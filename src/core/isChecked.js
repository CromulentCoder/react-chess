import getMoves from "./getMoves";

export default function isChecked(newSnapshot, turn) {
    // At max check from two pieces is possible
    let firstCheckingPiece = '', secondCheckingPiece = '';
    const pieceColor = turn === 'w' ? 'b' : 'w';
    const kingCode = newSnapshot.find(code => code.includes(pieceColor + 'K')).substring(2);
    // Get moves with new snapshot
    let { moves : movesPossibleWithNewSnapshot } = getMoves(newSnapshot, turn, [], '', 0, false, false);

    // Filter moves which reach the king
    movesPossibleWithNewSnapshot = movesPossibleWithNewSnapshot.filter(move => move.substring(4) === kingCode);
    
    if (movesPossibleWithNewSnapshot.length >= 1) firstCheckingPiece = movesPossibleWithNewSnapshot[0].substring(0, 4);
    if (movesPossibleWithNewSnapshot.length === 2) secondCheckingPiece = movesPossibleWithNewSnapshot[1].substring(0, 4);
    return {firstCheckingPiece, secondCheckingPiece};
}