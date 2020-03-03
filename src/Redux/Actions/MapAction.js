export const UPDATE_MAP = "map:updateMap";
export function updateMap(data){
    return{
        type: UPDATE_MAP,
        payload:{
            data
        }
    }
}
