import {
    GET_QUOTES
} from '../actions/types';

export default function(state = {}, action) {
    switch (action.type) {
        case GET_QUOTES:
            return Object.assign({}, state, action.payload)
    }

    return state;
}
