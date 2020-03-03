import {UPDATE_PLACE, CLEAR_PLACE} from '../Actions/PlaceAction';

export default function placeReducer(state=[], {type, payload}){
    switch(type){
        case UPDATE_PLACE:
            const newState ={...state, ...payload.data}
            return newState;
        case CLEAR_PLACE:
          return payload
        default:
            return state
    }
}
