import {UPDATE_MAP, UPDATE_HAZARDS} from '../Actions/MapAction';

export default function mapReducer(state=[], {type, payload}){
    switch(type){
        case UPDATE_MAP:
            const newState ={...state, ...payload.data}
            return newState;
        case UPDATE_HAZARDS:
            const newHazardState ={...state, hazards:payload}
            // Yay, set it!
            return newHazardState;
        default:
            return state
    }
}
