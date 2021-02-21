import { combineReducers } from 'redux'
import undoable, { includeAction } from 'redux-undo'
import game from './game'
import  settings from './settings'
import { TOGGLE_TURN } from '../actions'

export default combineReducers({
    game: undoable(game, {
        limit: false,
        filter: includeAction(TOGGLE_TURN),
        syncFilter: true,
    }),
    settings
})
