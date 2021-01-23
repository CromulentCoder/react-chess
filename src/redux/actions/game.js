import * as types from "./"

import getMoves from "../../core/getMoves";
// import { getNextMovable, getNextSnapshot, findCheckCode, applySpecialActions} from '~/chess/core'
// import { getSpecial, getPrevSnapshots, createTimeline, findCodeByTile, parseCode, replaceSnapshot, diffSnapshot} from '~/chess/helpers'
// import { isEmpty, lazy, merge } from '~/utils'

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

export function setMove (move) {
    return {
        type: types.SET_MOVE,
        payload: move
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

export function setCheckTo (code = '') {
    return {
        type: types.SET_CHECK_TO,
        payload: code
    }
}

export function setCheckBy (code = '') {
    return {
        type: types.SET_CHECK_BY,
        payload: code
    }
}

export function setSnapshot (snapshot) {
    return {
        type: types.SET_SNAPSHOT,
        payload: snapshot
    }
}

export function restartGame (ts = +new Date()) {
    return {
        type: types.RESTART_GAME,
        payload: ts
    }
}

export function setNext () {
    return (dispatch, getState) => {

        dispatch(setSelected())
        dispatch(setTs())

        const { game } = getState()
        const { present, past } = game
        const { turn } = present
        const checkBy = "";
        const checkTo = "";
        // const { checkTo, checkBy } = R.compose(
        // findCheckCode,
        // lazy,
        // merge({ turn, snapshot }),
        // parseCode,
        // diffSnapshot(snapshot),
        // R.prop(0),
        // getPrevSnapshots
        // )(past)

        dispatch(setCheckTo(checkTo))
        dispatch(setCheckBy(checkBy))
    }
}

export function setNextMovableTiles() {
    return (dispatch, getState) => {
        const { game } = getState();
        const { present, past } = game;
        const { snapshot, turn } = present;
        const { moves, move } = past || {};
        const newTurn = turn === '' ? 'w' : turn === 'w' ? 'b' : 'w';
        const newMoves = getMoves(snapshot, newTurn, moves, move, false);
        dispatch(setTs());
        dispatch(setMovable(newMoves));
        dispatch(toggleTurn(newTurn));
    }
}

export function setNextSelected (piece, code) {
    return (dispatch, getState) => {
        console.log("IN NEXT SELECTED")
        const { game } = getState()
        const { present } = game
        const { moves } = present
        
        let selectedMoves = [];
        
        for (let moveIndex = 0; moveIndex < moves.length; moveIndex++) {
            const move = moves[moveIndex];
            const sourceCode = move.substring(2,4);
            const destinationCode = move.substring(4, 6);
            if (sourceCode === code) selectedMoves.push(destinationCode);
        }
        dispatch(setSelected(piece + code));
        dispatch(setSelectedMoves(selectedMoves));
    };
    
}

export function setNextSnapshot (newMove) {
    return (dispatch, getState) => {
        console.log("IN NEXT SNAPSHOT")
        const { game } = getState();
        const { present } = game;
        const { selected, snapshot, turn, selectedMoves } = present;
        let newSnapshot = [...snapshot];
        if (selected && selected.charAt(0) === turn && selectedMoves.indexOf(newMove) !== -1) {
            let pieceIndex = newSnapshot.findIndex(code => code.includes(newMove));
            if (pieceIndex !== -1) {
                newSnapshot.splice(pieceIndex, 1);
            }
            pieceIndex = newSnapshot.indexOf(selected);
            newSnapshot.splice(pieceIndex, 1);
            const piece = selected.substring(0, 2);
            newSnapshot.push(piece + newMove);
            
            dispatch(setSelected(""));
            dispatch(setSelectedMoves([]));
            dispatch(setMove(selected + newMove));
            dispatch(setSnapshot(newSnapshot));
            dispatch(setNextMovableTiles());
        }
    }
}