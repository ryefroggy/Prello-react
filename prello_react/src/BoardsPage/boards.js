import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import { getBoards, addBoard } from './actions';
import '../boards.css';

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
            <button onClick={this.handleClick} id="logout" type="button" className="top">Logout</button>
        );
    }
}

class Heading extends Component {
    handleSubmit(e) {
        e.preventDefault();
        $("#add-board-menu").hide();
        const boardName = $('#board-name')[0].value;
        // var thisProps = this.props;
        // $.ajax({
        //     url: "http://localhost:3000/board",
        //     data: {
        //     name: $("#board-name")[0].value
        //     },
        //     type: "POST",
        //     dataType: "json"
        // })
        //     .done(function(json) {
        //         $("#add-board-menu")[0].reset();
        //         thisProps.AddBoard(json._id, json.name);
        //     });
        this.props.addBoard(boardName);
    }

    handleClick() {
        $("#add-board-menu").toggle();
    }

    render() {
        return(
            <header>
                <h2 className="top">Prello</h2>
                <button onClick={this.handleClick} id="add-board" type="button" className="top">Add Board</button>
                <Logout />
                <form onSubmit={this.handleSubmit.bind(this)} id="add-board-menu">
                    <input type="text" placeholder="name" id="board-name" name="name" required /><br />
                    <input className="button" type="submit" id="add-board-submit" value="Add" />
                </form>
            </header>
        )
    }
}

function Personal(props) {
    return(
        <section>
            <h1>Personal Boards</h1>
            {props.children}
        </section>
    );
}

function Shared(props) {
    return(
        <section>
            <h1>Shared Boards</h1>
            {props.children}
        </section>
    );
}

class Board extends Component {
    handleClick() {
        window.location.href = "http://localhost:3000/board/" + this.props.id;
    }

    render() {
        return(
            <div onClick={this.handleClick.bind(this)}><p>{this.props.name}</p></div>
        );
    }
}

class Boards extends Component {
    // constructor() {
    //     super();
    //     var PBoards = {};
    //     var SBoards = {};
    //     var t = this;
    //     $.ajax({
    //         url:'http://localhost:3000/board',
    //         type: 'GET',
    //         dataType: 'json'
    //     })
    //         .done(function(json) {
    //             PBoards = json.personal;
    //             SBoards = json.shared;
    //             t.setState({
    //                 PBoards: json.personal,
    //                 SBoards: json.shared
    //             });
    //         });
    //     this.state = {
    //         PBoards: PBoards,
    //         SBoards: SBoards,
    //     };
    // }

    // AddBoard(id, name) {
    //     var temp = this.state.PBoards;
    //     temp[id] = name;
    //     this.setState({
    //         PBoards: temp,
    //         SBoards: this.state.SBoards,
    //     });
    // }

    componentWillMount() {
        this.props.getBoards();
    }

    static isPrivate = true

    render() {
        const personalChildren = [];
        const sharedChildren = [];

        for(const x in this.props.personalBoards) {
            personalChildren.push(<Board key={x} id={x} name={this.props.personalBoards[x]}/>);
        }
        for(const y in this.props.sharedBoards) {
            sharedChildren.push(<Board key={y} id={y} name={this.props.sharedBoards[y]}/>);
        }

        return(
            <div className="boards">
                <Heading 
                    addBoard={this.props.addBoard}
                />

                <Personal>
                    {personalChildren}
                </Personal>
                <Shared>
                    {sharedChildren}
                </Shared>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    personalBoards: state.boards.personalBoards,
    sharedBoards: state.boards.sharedBoards,
    error: state.boards.error 
});

const mapDispatchToProps = dispatch => ({
    addBoard: boardName => dispatch(addBoard(boardName)),
    getBoards: () => dispatch(getBoards())
});

export default connect(mapStateToProps, mapDispatchToProps)(Boards);