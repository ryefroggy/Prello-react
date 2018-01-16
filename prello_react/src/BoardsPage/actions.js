import $ from 'jquery';

export const GET_BOARDS_START = 'GET_BOARDS_START';
export const GET_BOARDS_SUCCESS = 'GET_BOARDS_SUCCESS';
export const GET_BOARDS_ERROR = 'GET_BOARDS_ERROR';

export const getBoardsStart = () => ({
    type: GET_BOARDS_START
});

export const getBoardsSuccess = boards => ({
    type: GET_BOARDS_SUCCESS,
    payload: { boards }
});

export const getBoardsError = error => ({
    type: GET_BOARDS_ERROR,
    payload: { error }
});

export const getBoards = () =>
    (dispatch, getState) => {
        return $.ajax({
                url:'http://localhost:3000/board',
                type: 'GET',
                dataType: 'json'
        })
            .done(function(json) {
                const boards = json;
                dispatch(getBoardsSuccess(boards));
            })
            .fail(function(error) {
                dispatch(getBoardsError(error));
            });
    };  

export const ADD_BOARD_START = 'ADD_BOARD_START';
export const ADD_BOARD_SUCCESS = 'ADD_BOARD_SUCCESS';
export const ADD_BOARD_ERROR = 'ADD_BOARD_ERROR';

export const addBoardStart = () => ({
    type: ADD_BOARD_START
});

export const addBoardSuccess = (id, name) => ({
    type: ADD_BOARD_SUCCESS,
    payload: { id, name }
});

export const addBoardError = error => ({
    type: ADD_BOARD_ERROR,
    payload: { error }
});

export const addBoard = boardName =>
    (dispatch, getState) => {
        return $.ajax({
            url: "http://localhost:3000/board",
            data: {
            name: boardName
            },
            type: "POST",
            dataType: "json"
        })
            .done(function(json) {
                $("#add-board-menu")[0].reset();
                dispatch(addBoardSuccess(json._id, json.name));
            })
            .fail(function(error) {
                dispatch(addBoardError(error));
            });
    };