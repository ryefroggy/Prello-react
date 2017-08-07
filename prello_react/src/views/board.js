import React, { Component } from 'react';
import $ from 'jquery';
import '../board.css';

class BoardList extends Component {
    constructor() {
        super();
        var t = this;
        this.state = {
            PBoards: {},
            SBoards: {}
        };
        $.ajax({
            url: "http://localhost:3000/board",
            type: "GET",
            dataType: "json"
        })
            .done(function(json) {
                t.setState({
                    PBoards: json.personal,
                    SBoards: json.shared
                });
            });
    }

    handleClick() {
        $("#board-list").toggle();
    }

    render() {
        const personalChildren = [];
        const sharedChildren = [];

        for(var x in this.state.PBoards) {
            personalChildren.push(<ListBoard key={x} id={x} name={this.state.PBoards[x]}/>);
        }
        for(var y in this.state.SBoards) {
            sharedChildren.push(<ListBoard key={y} id={y} name={this.state.PBoards[y]}/>);
        }

        return(
            <div>
                <button onClick={this.handleClick} className="top left" id="board-list-btn">Boards</button>
                <ul id="board-list">
                    <li><p>Personal Boards</p></li>
                    {personalChildren}
                    <li><p>Shared Boards</p></li>
                    {sharedChildren}
                </ul>
            </div>
        ); 
    }
}

class ListBoard extends Component {
    handleClick() {
        window.location.href = "http://localhost:3000/board/" + this.props.id;
    }

    render() {
        return(
            <li id={this.props.id} className="board"><button onClick={this.handleClick.bind(this)}>{this.props.name}</button></li>
        );
    }
}

class OptMenu extends Component {
    handleClick() {
        $("#opt-menu").toggle();
    }

    render() {
        return(
            <div className="top right">
                <button id="opt-menu-btn" onClick={this.handleClick}>{this.props.username}</button>
                <ul id="opt-menu">
                    <li id="username">{this.props.username}</li>
                    <li><div className="line"></div></li>
                    <li><button>Profile</button></li>
                    <li><button>Cards</button></li>
                    <li><button>Settings</button></li>
                    <li><div className="line"></div></li>
                    <li><button>Help</button></li>
                    <li><button>Shortcuts</button></li>
                    <li><button>Change Language...</button></li>
                    <li><div className="line"></div></li>
                    <li><Logout /></li>
                </ul>
            </div>
        );
    }
}

class Logout extends Component {
    handleClick() {
        $.ajax({
            url: "http://localhost:3000/logout",
            type: "GET",
            dataType:"json",
            })
            .done(function(json) {
                window.location.href = 'http://localhost:3000/login';
            });
    }

    render() {
        return(
            <button onClick={this.handleClick} id="logout">Log Out</button>
        );
    }
}

class Menu extends Component {
    handleClick() {
        $("#menu").animate({
            right: 0
            }, 200);
    }

    handleClose() {
        $("#menu").animate({
            right: -500
            }, 200);
            $("#mem-success").hide();
            $("#mem-fail").hide();
    }

    render() {
        return(
            <div>
                <button onClick={this.handleClick} className="bottom right" id="menu-open">Show Menu</button>
                <div id="menu">
                    <ul id="menu-top">
                        <li><h3 id="top">Menu</h3></li>
                        <li><h2 onClick={this.handleClose} id="close">x</h2></li>
                    </ul>
                    <BoardMembers />
                    <ul id="options">
                        <li><button>Change Background</button></li>
                        <li><button>Filter Cards</button></li>
                        <li><button>Power-Ups</button></li>
                        <li><button>Stickers</button></li>
                        <li><button>More</button></li>
                    </ul>
                </div>
            </div>
        );
    }
}

class BoardMembers extends Component {
    constructor() {
        super();
        var t = this;
        $.ajax({
            url: "http://localhost:3000/board/" + window.location.pathname.substring(7),
            type: "GET",
            dataType: "json"
        })
            .done(function(json) {
                console.log(json.members);
                t.setState({
                   members: json.members
                });
            });
        this.state= {
            members: []
        };
    }

    handleClick() {
        $("#add-mem-form").toggle();
        $("#mem-success").hide();
        $("#mem-fail").hide();
    }

    handleSubmit(e) {
        e.preventDefault();
        var username = $("#mem-username")[0].value;
        var t = this;
        $.ajax({
            url: "http://localhost:3000/board/" + window.location.pathname.substring(7) + "/member",
            data: {
                member: username
            },
            type: "POST",
            dataType: "json"
            })
            .done(function(json) {
                if(json.err) {
                    $("#mem-fail").show();
                }
                else {
                    $("#mem-success").show();
                }
                var temp = t.state.members;
                temp.push(username);
                t.setState({
                    members: temp
                });
            });
        $("#add-mem-form").hide();
        $("#add-mem-form")[0].reset();
    }

    render() {
        var memberButtons = [];

        for(let i = 0; i < this.state.members.length; i++) {
            memberButtons.push(<li className="mem-li" key={i}><button className="member">{this.state.members[i]}</button></li>);
        }

        return(
            <div>
                <ul>
                    <li id="members">Members</li>
                    {memberButtons}
                </ul>
                <button id="add-mem" onClick={this.handleClick}>Add Members...</button>
                <form onSubmit={this.handleSubmit.bind(this)} id="add-mem-form">
                    <input type="text" name="username" id="mem-username" required />
                    <input className="button" type="submit" id="mem-submit" />
                </form>
                <p id="mem-success">Member successfully added!</p>
                <p id="mem-fail">User does not exist</p>
            </div>
        );
    }
}

class ListofLists extends Component {
    handleClick() {
        $("#list-form").show();
        $("#list-add-p").hide();
    }

    handleSubmit(e) {
        e.preventDefault();
        var l_name = $("#list-name")[0].value;
        var t = this;
        $.ajax({
            url: "http://localhost:3000/board/" + window.location.pathname.substring(7) +"/list/",
            data: {
                name: l_name
            },
            type: "POST",
            dataType: "json"
        })
        .done(function(json){
            t.props.addList(json._id, json.name);
        });
        $("#list-form").hide();
        $("#list-add-p").show();
        $("#list-form")[0].reset();
    }

    render() {
        var lists = [];

        for (let i = 0; i < Object.keys(this.props.lists).length; i++) {
            lists.push(<List addCard={this.props.addCard} key={i} list={this.props.lists[i]} />);
        }

        return(
            <section>
                <ul id="lol">
                    {lists}
                    <li id="final" onClick={this.handleClick}><p id="list-add-p" >Add a list...</p>
                        <form id="list-form" onSubmit={this.handleSubmit.bind(this)}>
                            <input type="text" id="list-name" name="list-name" placeholder="Add a list..." required /><br />
                            <input className="button" type="submit" value="Save" id="list-name-submit" />
                        </form>
                    </li>
                </ul>
            </section>
        );
    }
}

class List extends Component {
    render() {
        return(
            <li>hi</li>
        );
    }
}

class Board extends Component {
    constructor() {
        super();
        var t = this;
        $.ajax({
            url: "http://localhost:3000/users",
            type: "GET",
            dataType: "json"
        })
            .done(function(json) {
                t.setState({
                    username: json.username,
                    boardname: t.state.boardname
                });
            });

        $.ajax({
            url: "http://localhost:3000/board/" + window.location.pathname.substring(7),
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
                t.setState({
                    username: t.state.username,
                    boardname: json.name,
                    lists: data
                });
            });

        this.state = {
            username: "",
            boardname: "",
            lists: {}
        };
    }

    addList(id, name) {
        var data = this.state.lists;
        data[id] = {name: name, cards: {}};
        this.setState({
            username: this.state.username,
            boardname: this.state.boardname,
            lists: data
        });
    }

    addCard(id, name) {

    }

    static isPrivate = true;

    render() {
        return (
            <div className="board-page">
                <header>
                    <div id="tdiv">
                        <BoardList />
                        <h2 className="top" id="logo">Prello</h2>
                        <OptMenu username={this.state.username} />
                    </div>
                    <div id="bdiv">
                        <h3 className="bottom left">{this.state.boardname}</h3>
                        <Menu />
                    </div>
                </header>

                <ListofLists addCard={this.addCard.bind(this)} addList={this.addList.bind(this)} lists={this.state.lists} />

                <div id="modal">
                    <div id="modal-bg" className="modal-close">

                    </div>
                    <div id="modal-fg">
                        <div className="card" id="card-show">
                            <ul>
                                <li className="outer" id="card-left">
                                    <form id="card-head-form">
                                        <input type="text" id="card-title" name="card-title" placeholder="Title" required />
                                        <input className="button" type="submit" value="Save" id="card-title-submit" />
                                    </form>
                                    <ul className="list" id="left-list">
                                        <li className="labels">

                                        </li>
                                    </ul>
                                    <div className="description">
                                        <h4>Description <span>Edit</span></h4>
                                        <p id="cur-desc">Add a description!</p>
                                        <form id="desc-form">
                                            <textarea name="description" id="desc" defaultValue="Add a description!"></textarea><br />
                                            <input type="submit" id="desc-button" value="Save" />
                                        </form>
                                    </div>
                                    <div className="comments">
                                        <h4>Add Comment</h4>
                                        <form id="new-write-comment">
                                            <textarea placeholder="Write a comment..." name="comment" id="comment-textarea" required></textarea><br/>
                                            <input className="button" type="submit" value="Save" id="comment-submit" />
                                        </form>
                                    </div>
                                    <div className="activity">
                                        <h4 id="activity">Activity</h4>
                                    </div>
                                </li>
                                <li className="outer card-right">
                                    <div>
                                        <button id="close-card" className="modal-close">x</button>
                                    </div>
                                    <h4>Add</h4>
                                    <ul>
                                        <li><button className="add-member">Members</button></li>
                                        <li><button className="add-label">Labels</button></li>
                                        <li><button>Checklist</button></li>
                                        <li><button>Due Date</button></li>
                                        <li><button>Attachment</button></li>
                                    </ul>
                                    <h4>Actions</h4>
                                    <ul>
                                        <li><button>Move</button></li>
                                        <li><button>Copy</button></li>
                                        <li><button>Subscribe</button></li>
                                        <li><button id="delete-card">Delete</button></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <form id="label-form">
                    <input type="text" id="label-text" name="label-text" placeholder="name" /><br />
                    <button className="red"></button><br />
                    <button className="orange"></button><br />
                    <button className="yellow"></button><br />
                    <button className="green"></button><br />
                    <button className="blue"></button><br />
                    <button className="purple"></button><br />
                    <button className="violet"></button><br />
                    <button className="pink"></button><br />
                </form>
            </div>
        );
    }
}

export default Board