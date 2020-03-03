import {UPDATE_ALERT, CLOSE_ALERT} from '../Actions/AlertAction';

export default function alertReducer(state=[], {type, payload}){
    switch(type){
        case UPDATE_ALERT:
            const newState ={...state, ...payload.data}
            return newState;
        case CLOSE_ALERT:
          return payload
        default:
            return state
    }
}
