export const UPDATE_MAP = "map:updateMap";
export function updateMap(data){
    return{
        type: UPDATE_MAP,
        payload:{
            data
        }
    }
}

export const UPDATE_HAZARDS = "map:updateHazards";
export function updateHazards(payload){
    return{
        type: UPDATE_HAZARDS,
        payload
    }
}
