export const UPDATE_PLACE = "place:updatePlace";
export function updatePlace(place){
    return{
        type: UPDATE_PLACE,
        payload:{
            place
        }
    }
}

export const CLEAR_PLACE = "place:clearPlace";
export function clearPlace(){
    return{
        type: CLEAR_PLACE,
        payload:{
          place:{
            id:0,
            query:""
          }
        }
    }
}
