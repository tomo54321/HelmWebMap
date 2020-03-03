import {UPDATE_USER} from '../Actions/UserAction';

export default function userReducer(state=[], {type, payload}){
    switch(type){
        case UPDATE_USER:
            const newState ={...state, ...payload.user}
            return newState;
        default:
            return state
    }
}
