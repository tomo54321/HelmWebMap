export const UPDATE_USER = "user:updateUSER";
export function updateUser(user){
    return{
        type: UPDATE_USER,
        payload:{
            user
        }
    }
}
