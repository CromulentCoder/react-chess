import * as types from "./";

import { ActionCreators } from "redux-undo";
import { setNextMovableTiles } from "./game";


export function setReset() {
    return {
        type: types.RESET
    }
}

export function toggleCoordinates() {
    return(dispatch, getState) => {
        const coords = getState().settings.coords;
        dispatch({
            type: types.TOGGLE_COORDS,
            payload: !coords
        })
    }
}

export function reset() {
    return (dispatch) => {
        dispatch(ActionCreators.clearHistory());
        dispatch(setReset());
        dispatch(setNextMovableTiles());
    }
}