import * as types from "./";

import { ActionCreators } from "redux-undo";
import { setNextMovableTiles } from "./game";

export function setReset() {
    return {
        type: types.RESET
    }
}

export function undoSnapshot() {
    return (dispatch, getState) => {
        const { game } = getState();
        const { past } = game;
        if (past.length > 1) {
            dispatch(ActionCreators.jumpToPast(past.length - 1));
        }
    }
}

export function redoSnapshot() {
    return (dispatch, getState) => {
        const { game } = getState();
        const { future } = game;
        if(future.length > 0) dispatch(ActionCreators.jumpToFuture(0));
    }
}

export function reset() {
    return (dispatch) => {
        dispatch(ActionCreators.clearHistory());
        dispatch(setReset());
        dispatch(setNextMovableTiles());
    }
}

export function undoSnapshotByIndex(index) {
    return (dispatch) => {
        dispatch(ActionCreators.jumpToPast(index));
    }
}

export function redoSnapshotByIndex(index) {
    return (dispatch) => {
        dispatch(ActionCreators.jumpToFuture(index));
    }
}
