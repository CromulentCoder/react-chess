import * as types from '../actions';

const initialState = {
    coords: true
}

export default function settings (state = initialState, action = {}) {
    const { type, payload } = action
    switch (type) {
        case types.TOGGLE_COORDS: {
            return {
                ...state,
                coords: payload
            }
        }

        default: {
            return state;
        }
    }
}



