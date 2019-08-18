import {FIND_FALCONE_SUCCESS,FIND_FALCONE_ERROR, FIND_FALCONE_SERVER_ERROR} from '../actions/types';
let initialState = {
    findFalconeResp : '',
    findFalconeSuccess: false,
    findFalconeError: false,
    findFalconeServerError : '',
    timeTaken: 0
}
export const searchReducer = (state = initialState,actions) => {
    switch(actions.type){
        case FIND_FALCONE_SUCCESS: return {
            ...state,
            findFalconeResp: actions.data,
            findFalconeSuccess: true,
            findFalconeError: false,
            findFalconeServerError: '',
            timeTaken: actions.timeTaken
        }
        case FIND_FALCONE_ERROR : return {
            ...state,
            findFalconeResp: '',
            findFalconeSuccess: false,
            findFalconeError: true,
            findFalconeServerError: '',
            timeTaken: actions.timeTaken
        }
        case FIND_FALCONE_SERVER_ERROR: return {
            ...state,
            findFalconeResp: '',
            findFalconeSuccess: false,
            findFalconeError: false,
            findFalconeServerError: actions.data
        }
        default: return{
            ...state
        }
    }
}
