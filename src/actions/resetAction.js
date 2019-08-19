import { RESET, RESET_BACK } from "./types";

export const resetAll = () => (dispatch) => {
    dispatch({
        type:RESET
    })
}
export const setResetBack = () => (dispatch) => {
    dispatch({
        type: RESET_BACK
    })
}