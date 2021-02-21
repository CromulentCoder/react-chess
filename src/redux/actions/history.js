import { ActionCreators } from "redux-undo";

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
