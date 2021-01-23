import { combineReducers } from 'redux'
import undoable, { ActionTypes, excludeAction } from 'redux-undo'
import { TOGGLE_TURN, SET_MOVABLE_TILES, SET_SELECTED, SET_SELECTED_MOVES } from '../actions'
import game from './game'

export default combineReducers({
    game: undoable(game, {
        limit: false,
        undoType: ActionTypes.UNDO,
        filter: excludeAction([TOGGLE_TURN, SET_MOVABLE_TILES, SET_SELECTED, SET_SELECTED_MOVES])
    })
})
