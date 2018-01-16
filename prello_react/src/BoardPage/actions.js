import $ from 'jquery';

export const GET_BOARD_SUCCESS = 'GET_BOARD_SUCCESS';
export const GET_BOARD_ERROR = 'GET_BOARD_ERROR';

export const getBoardSuccess = lists => ({
    type: GET_BOARD_SUCCESS,
    payload: { lists }
});

export const getBoardError = error => ({
    type: GET_BOARD_ERROR,
    payload: { error }
});

export const getBoard = (boardId) =>
    (dispatch, getState) => {
        return $.ajax({
            url: "http://localhost:3000/board/" + boardId,
            type: "GET",
            dataType: "json"
        })
            .done(function(json) {
                var data = {};
                for (let i = 0; i < json.lists.length; i++) {
                    var list = json.lists[i];
                    data[list._id] = {name: list.name, cards: {}};
                    for(let c = 0; c < list.cards.length; c++) {
                        var card = list.cards[c];
                        if(card.members[0] === '') {
                            var members = [];
                        }
                        else {
                            var members = card.members;
                        }
                        if (card.comments[0] === '') {
                            var comments = [];
                        }
                        else {
                            var comments = card.comments;
                        }
                        data[list._id].cards[card._id] = { "title" : card.title,
                                                                "author": card.author,
                                                                "labels" : {},
                                                                "members": members,
                                                                "description" : card.description,
                                                                "comments" : comments};
                        for(let x = 0; x < comments.length; x++) {
                            data[list._id].cards[card._id].comments[x].date = new Date(data[list._id].cards[card._id].comments[x].date);
                        }
                        for(let y = 0; y < card.labels.length; y++) {
                            data[list._id].cards[card._id].labels[card.labels[y]._id] = {"name": card.labels[y].name, "color": card.labels[y].color};
                        }
                    }
                }
                dispatch(getBoardSuccess(data));
            })
            .fail(function(error) {
                dispatch(getBoardError(error));
            });

    };

export const ADD_LIST_SUCCESS = 'ADD_LIST_SUCCESS';
export const ADD_LIST_ERROR = 'ADD_LIST_ERROR';

export const addListSuccess = (id, name) => ({
    type: ADD_LIST_SUCCESS,
    payload: { id, name }
});

export const addListError = (error) => ({
    type: ADD_LIST_ERROR,
    payload: { error }
});

export const addList = (listName, boardId) =>
    (dispatch, getState) => {
        return $.ajax({
            url: "http://localhost:3000/board/" + boardId +"/list/",
            data: {
                name: listName
            },
            type: "POST",
            dataType: "json"
        })
        .done(function(json){
            dispatch(addListSuccess(json._id, json.name));
        })
        .fail(function(error) {
            dispatch(addListError(error));
        });
    };

export const GET_MEMBERS_SUCCESS = 'GET_MEMBERS_SUCCESS';
export const GET_MEMBERS_ERROR = 'GET_MEMBERS_ERROR';

export const getMembersSuccess = (members) => ({
    type: GET_MEMBERS_SUCCESS,
    payload: { members }
});

export const getMembersError = (error) => ({
    type: GET_MEMBERS_ERROR,
    payload: { error }
});

export const getMembers = (boardId) =>
    (dispatch, getState) => {
        return $.ajax({
            url: "http://localhost:3000/board/" + boardId,
            type: "GET",
            dataType: "json"
        })
            .done(function(json) {
                dispatch(getMembersSuccess(json.members));
            })
            .fail(function(error) {
                dispatch(getMembersError(error));
            });
    };