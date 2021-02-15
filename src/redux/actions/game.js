import * as types from "./"

import getMoves from "../../core/getMoves";

import isChecked, { getCheckingMoves } from "../../core/isChecked";

export function setTs (ts = +new Date()) {
    return {
        type: types.SET_TS,
        payload: ts
    }
}

export function setSelected (code = '') {
    return {
        type: types.SET_SELECTED,
        payload: code
    }
}

export function setMovable (moves = []) {
    return {
        type: types.SET_MOVABLE_TILES,
        payload: moves
    }
}

export function setSpecialMovable (moves = []) {
    return {
        type: types.SET_SPECIAL_MOVABLE_TILES,
        payload: moves
    }
}

export function setSelectedMoves (possibleMoves = []) {
    return {
        type: types.SET_SELECTED_MOVES,
        payload: possibleMoves
    }
}

export function toggleTurn (turn) {
    return {
        type: types.TOGGLE_TURN,
        payload: turn
    }
}

export function setCheckedByPieces (checkedByPieces = 0) {
    return {
        type: types.SET_IS_CHECKED,
        payload: checkedByPieces
    }
}

export function setCheckingMoves (checkingMoves = []) {
    return {
        type: types.SET_CHECKING_MOVES,
        payload: checkingMoves
    }
}

export function setKingMoved( hasKingMoved = [false, false]) {
    return {
        type: types.SET_KING_MOVED,
        payload: hasKingMoved
    }
}

export function setPromotionCode(code) {
    return {
        type: types.SET_PROMOTION_CODE,
        payload: code
    }
}

export function setSnapshot (snapshot) {
    return {
        type: types.SET_SNAPSHOT,
        payload: snapshot
    }
}

export function setSnapshotMove (move = '') {
    return {
        type: types.SET_SNAPSHOT_MOVE,
        payload: move
    }
}

export function setCheck (checkedByPieces, checkingMoves) {
    return (dispatch) => {        
        dispatch(setCheckedByPieces(checkedByPieces));
        dispatch(setCheckingMoves(checkingMoves));
    }
}

export function setNextMovableTiles() {
    return (dispatch, getState) => {
        const { game } = getState();
        
        const { present, past } = game;
        const { moves } = past[past.length - 1] || [];
        const { turn, checkedByPieces, checkingMoves, snapshot, snapshotMove, kingMoved } = present || {};
        const hasKingMoved = turn === 'w' ? kingMoved[0] : kingMoved[1];
        const { moves: newMoves, specialMoves } = getMoves(snapshot, turn, moves, snapshotMove, checkedByPieces, checkingMoves, hasKingMoved);

        dispatch(setMovable(newMoves));
        dispatch(setSpecialMovable(specialMoves));
    }
}

export function setNextSelected (piece, code) {
    return (dispatch, getState) => {
        const { game } = getState()
        const {present } = game;

        const { moves, promotionCode } = present;
        
        let selectedMoves = [];
        
        for (let moveIndex = 0; moveIndex < moves.length; moveIndex++) {
            const move = moves[moveIndex];
            const sourceCode = move.substring(2,4);
            const destinationCode = move.substring(4, 6);
            if (sourceCode === code) selectedMoves.push(destinationCode);
        }

        if (promotionCode) dispatch(setPromotionCode(''));

        dispatch(setSelected(piece + code));
        dispatch(setSelectedMoves(selectedMoves));
    };
}

export function setNextSnapshot (newMove, promotionPiece = '') {
    return (dispatch, getState) => {
        const { game } = getState();
        const { present } = game;

        const { snapshot, selected, turn, selectedMoves, checkedByPieces, specialMoves, kingMoved } = present;

        let newSnapshot = [...snapshot];
        let newTurn = turn === 'w' ? 'b' : 'w';
        let newSnapshotMove = '';
        if (selected && selected.charAt(0) === turn && selectedMoves.indexOf(newMove) !== -1) {
            let pieceIndex = newSnapshot.findIndex(code => code.includes(newMove));
            let captured = false;
            if (pieceIndex !== -1) {
                captured = true;
                newSnapshot.splice(pieceIndex, 1);
            }
            pieceIndex = newSnapshot.indexOf(selected);
            newSnapshot.splice(pieceIndex, 1);
            const piece = selected.substring(0, 2);
            newSnapshot.push(piece + newMove);
            
            specialMoves.forEach(moveArray => {
                const firstMove = moveArray[0], secondMove = moveArray[1];
                if (firstMove.substring(4) !== newMove) return;
                // Castling
                if (firstMove.charAt(1) === 'K') {
                    const rookPiece = secondMove.substring(0, 2);
                    const initalPos = secondMove.substring(2, 4);
                    const finalPos = secondMove.substring(4);
                    pieceIndex = newSnapshot.indexOf(rookPiece + initalPos);
                    newSnapshot.splice(pieceIndex, 1);
                    newSnapshot.push(rookPiece + finalPos);
                    if (initalPos.includes("a")) newSnapshotMove = "O-O-O";
                    else newSnapshotMove = "O-O";
                    // Promotion
                } else if (firstMove === secondMove) {
                    pieceIndex = newSnapshot.indexOf(piece + newMove);
                    newSnapshot.splice(pieceIndex, 1);
                    newSnapshot.push(promotionPiece + newMove);
                    newSnapshotMove = selected;
                    if (captured) newSnapshotMove += "x";
                    newSnapshotMove += newMove + "=" + promotionPiece.charAt(1);
                    // Enpassant
                } else {
                    pieceIndex = newSnapshot.indexOf(secondMove);
                    captured = true;
                    newSnapshot.splice(pieceIndex, 1);
                }
            })
            if (newSnapshotMove === '') {
                newSnapshotMove = selected;
                newSnapshotMove += captured ? "x" : "";
                newSnapshotMove += newMove;
            }
            const {firstCheckingPiece, secondCheckingPiece} = isChecked(newSnapshot, turn);
            if (firstCheckingPiece) {
                let newCheckedByPieces = 1;
                let checkingMoves = [...getCheckingMoves(newSnapshot, firstCheckingPiece)];
                if (secondCheckingPiece) {
                    newCheckedByPieces++;
                    checkingMoves = [...checkingMoves, ...getCheckingMoves(newSnapshot, secondCheckingPiece)];
                }
                newSnapshotMove += "+";
                dispatch(setCheck(newCheckedByPieces, checkingMoves));
            } else if (checkedByPieces > 0) {
                dispatch(setCheck(0, []));
            }

            if (selected.charAt(1) === 'K') {
                if (turn === 'w') dispatch(setKingMoved([true, kingMoved[1]]));
                else dispatch(setKingMoved([kingMoved[0], true]))
            }
            
            dispatch(setSelected(''));
            dispatch(setSelectedMoves([]));
            dispatch(setPromotionCode(''));

            dispatch(toggleTurn(newTurn));
            dispatch(setTs());
            dispatch(setSnapshotMove(newSnapshotMove));
            dispatch(setSnapshot(newSnapshot));
            dispatch(setNextMovableTiles());
            
        }
    }
}