export const UPDATE_ALERT = "alert:updateAlert";
export function updateAlert(data){
    return{
        type: UPDATE_ALERT,
        payload:{
            data
        }
    }
}

export const CLOSE_ALERT = "alert:closeAlert";
export function closeAlert(){
    return{
        type: CLOSE_ALERT,
        payload:{
          data:{
            show:false,
          }
        }
    }
}
