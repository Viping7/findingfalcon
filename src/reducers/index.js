import {combineReducers} from 'redux';
import { searchReducer } from './searchReducer';
const appReducer = combineReducers({
    search:searchReducer
})
const rootReducer = (state,action) => {
    if(action.type === 'RESET'){
        state = undefined;
    }
    return appReducer(state,action);
}
export default rootReducer;