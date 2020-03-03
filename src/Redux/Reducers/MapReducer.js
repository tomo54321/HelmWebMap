import {UPDATE_MAP} from '../Actions/MapAction';

export default function mapReducer(state=[], {type, payload}){
    switch(type){
        case UPDATE_MAP:
            const newState ={...state, ...payload.data}
            return newState;
        default:
            return state
    }
}
