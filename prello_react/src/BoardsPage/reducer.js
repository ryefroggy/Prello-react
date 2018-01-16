import * as boardsActions from './actions';

const initialState = {
    personalBoards: {},
    sharedBoards: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case boardsActions.GET_BOARDS_SUCCESS: 
            return {
                personalBoards: action.payload.boards.personal,
                sharedBoards: action.payload.boards.shared
            }
        case boardsActions.ADD_BOARD_SUCCESS:
            const board = {};
            board[action.payload.id] = action.payload.name;
            return {
                ...state,
                personalBoards: { ...state.personalBoards, ...board }
            }
        default:
            return state;
    }
};
