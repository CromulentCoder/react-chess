import * as types from '../actions';
import { INITIAL_SNAPSHOT } from "../../constants";

// prettier-ignore
const initialState = {
    timestamp: +new Date(),
    turn: 'w',
    moves: [],
    specialMoves: [],
    selected: '',
    selectedMoves: [],
    checkedByPieces: 0,
    snapshot: INITIAL_SNAPSHOT,
    snapshotMove: '',
    captured: false,
    promotionCode: '',
    kingMoved: [false, false],
    coords: true
}

function game (state = initialState, action = {}) {
    const { type, payload } = action
    switch (type) {
        case types.SET_TS: {
            return {
                ...state,
                timestamp: payload
            }
        }

        case types.TOGGLE_TURN: {
            return {
                ...state,
                turn: payload
            }
        }

        case types.SET_MOVABLE_TILES: {
            return {
                ...state,
                moves: payload
            }
        }

        case types.SET_SPECIAL_MOVABLE_TILES: {
            return {
                ...state,
                specialMoves: payload
            }
        }

        case types.SET_SELECTED: {
            return {
                ...state,
                selected: payload
            }
        }
        
        case types.SET_SELECTED_MOVES: {
            return {
                ...state,
                selectedMoves: payload
            }
        }

        case types.SET_PROMOTION_CODE: {
            return {
                ...state,
                promotionCode: payload
            }
        }

        case types.SET_IS_CHECKED: {
            return {
                ...state,
                checkedByPieces: payload
            }
        }

        case types.SET_KING_MOVED: {
            return {
                ...state,
                kingMoved: payload
            }
        }

        case types.SET_SNAPSHOT: {
            return {
                ...state,
                snapshot: payload
            }
        }

        case types.SET_SNAPSHOT_MOVE: {
            return {
                ...state, 
                snapshotMove: payload
            }
        }

        case types.SET_CAPTURED: {
            return {
                ...state,
                captured: payload
            }
        }

        case types.RESET: {
            return {
                ...initialState
            }
        }

        default: {
            return state
        }
    }
}

export default game
