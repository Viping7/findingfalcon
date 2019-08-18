import {combineReducers} from 'redux';
import { searchReducer } from './searchReducer';
const appReducer = combineReducers({
    search:searchReducer
})
const rootReducer = (state,action) => {
    return appReducer(state,action);
}
export default rootReducer;