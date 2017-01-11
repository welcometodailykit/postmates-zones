import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import quoteReducer from './quote_reducer';

const rootReducer = combineReducers({
    quotes: quoteReducer,
    form
});

export default rootReducer;
