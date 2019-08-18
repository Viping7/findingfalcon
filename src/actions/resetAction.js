import { RESET } from "./types";

export const resetAll = () => (dispatch) => {
    dispatch({
        type:RESET
    })
}