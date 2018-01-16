import { combineReducers } from 'redux';

import boards from './BoardsPage/reducer';
import board from './BoardPage/reducer';

export default combineReducers({
    boards,
    board
});