import * as boardActions from './actions';

const initialState = {
    members: {},
    lists: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case boardActions.GET_BOARD_SUCCESS: 
            console.log(action);
            return {
                ...state,
                lists: action.payload.lists
            };
        case boardActions.ADD_LIST_SUCCESS:
            const list = {};
            list[action.payload.id] = action.payload.name;
            return {
                ...state,
                lists: { ...state.lists, ...list }
            };
        case boardActions.GET_MEMBERS_SUCCESS:
            return {
                ...state,
                members: action.payload.members
            };
        default:
            return state;
    }
};
