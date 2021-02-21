import * as types from "./"

import getMoves from "../../core/getMoves";

import isChecked from "../../core/isChecked";

export function setTs (ts = +new Date()) {
    return {
        type: types.SET_TS,
        payload: ts
    }
}

export function toggleTurn (turn) {
    return {
        type: types.TOGGLE_TURN,
        payload: turn
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

export function setSelected (code = '') {
    return {
        type: types.SET_SELECTED,
        payload: code
    }
}

export function setSelectedMoves (possibleMoves = []) {
    return {
        type: types.SET_SELECTED_MOVES,
        payload: possibleMoves
    }
}

export function setCheckedByPieces (checkedByPieces = 0) {
    return {
        type: types.SET_IS_CHECKED,
        payload: checkedByPieces
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

export function setCaptured (captured) {
    return {
        type: types.SET_CAPTURED,
        payload: captured
    }
}

export function setNextMovableTiles() {
    return (dispatch, getState) => {
        const { game } = getState();
        
        const { present, past } = game;
        const { moves } = past[past.length - 1] || [];
        const { turn, checkedByPieces, snapshot, snapshotMove, kingMoved } = present || {};
        const hasKingMoved = turn === 'w' ? kingMoved[0] : kingMoved[1];
        let { moves: newMoves, specialMoves } = getMoves(snapshot, turn, moves, snapshotMove, checkedByPieces, hasKingMoved);

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

        // Return if not no selected or not turn or not a possible move
        if (!selected || !selected.charAt(0) === turn || selectedMoves.indexOf(newMove) === -1) return;
        
        let newSnapshot = [...snapshot];
        let newTurn = turn === 'w' ? 'b' : 'w';
        let newSnapshotMove = '';
        let captured = false;
        let pieceIndex = newSnapshot.findIndex(code => code.includes(newMove));

        // Check if piece is captured and remove it from board
        if (pieceIndex !== -1) {
            captured = true;
            newSnapshot.splice(pieceIndex, 1);
        }

        // Remove the selected piece from old position and add in new position
        pieceIndex = newSnapshot.indexOf(selected);
        newSnapshot.splice(pieceIndex, 1);
        const piece = selected.substring(0, 2);
        newSnapshot.push(piece + newMove);
        
        // Check if move is a special move (castling, promotion, enpassant)
        specialMoves.forEach(moveArray => {
            const firstMove = moveArray[0], secondMove = moveArray[1];
            if (firstMove.substring(4) !== newMove) return;

            if (firstMove.charAt(1) === 'K') { // Check if its castling move
                const rookPiece = secondMove.substring(0, 2);
                const initalPos = secondMove.substring(2, 4);
                const finalPos = secondMove.substring(4);

                // Remove selected rook from old position and add in new position
                pieceIndex = newSnapshot.indexOf(rookPiece + initalPos);
                newSnapshot.splice(pieceIndex, 1);
                newSnapshot.push(rookPiece + finalPos);

                if (initalPos.includes("a")) newSnapshotMove = "O-O-O";
                else newSnapshotMove = "O-O";
            } else if (firstMove === secondMove) { // Check if its promotion move

                // Replace pawn with promoted piece
                pieceIndex = newSnapshot.indexOf(piece + newMove);
                newSnapshot.splice(pieceIndex, 1);
                newSnapshot.push(promotionPiece + newMove);

                newSnapshotMove = selected + newMove + "=" + promotionPiece.charAt(1);
            } else { // Check if its enpassant move
                
                // Remove captured pawn 
                pieceIndex = newSnapshot.indexOf(secondMove);
                captured = true;
                newSnapshot.splice(pieceIndex, 1);
            }
        })
        if (newSnapshotMove === '') {
            newSnapshotMove = selected;
            newSnapshotMove += newMove;
        }

        // Check if checked
        const {firstCheckingPiece, secondCheckingPiece} = isChecked(newSnapshot, turn);
        if (firstCheckingPiece) {
            let newCheckedByPieces = 1;
            if (secondCheckingPiece) {
                newCheckedByPieces++;
            }
            dispatch(setCheckedByPieces(newCheckedByPieces))        
        } else if (checkedByPieces > 0) { // Clear check from previous turn if checked
            dispatch(setCheckedByPieces(0));
        }

        if (selected.charAt(1) === 'K') { // Check if its a king move
            if (turn === 'w') dispatch(setKingMoved([true, kingMoved[1]]));
            else dispatch(setKingMoved([kingMoved[0], true]))
        }
        
        dispatch(setSelected(''));
        dispatch(setSelectedMoves([]));
        if (promotionPiece !== '') dispatch(setPromotionCode(''));

        dispatch(toggleTurn(newTurn));
        dispatch(setTs());
        dispatch(setSnapshot(newSnapshot));
        dispatch(setSnapshotMove(newSnapshotMove));
        dispatch(setCaptured(captured));
        dispatch(setNextMovableTiles());
    }
}