import React, { Component } from 'react';
import $ from 'jquery';
import '../login.css';

class Register extends Component {
    handleSubmit(e) {
        e.preventDefault();
        if($("#reg-password").val() !== $("#password-confirm").val()) {
            alert("Passwords don't match");
        }
        else{
            $.ajax({
            url: "http://localhost:3000/users",
            data: {
                username: $("#reg-username").val(),
                email: $("#reg-email").val(),
                password: $("#reg-password").val()
            },
            type: "POST",
            dataType: "json"
            })
            .done(function(json) {
                if(json.error === "yes") {
                alert("Username is already in use.");
                }
                else {
                window.location.href = 'http://localhost:3000';
                }
            });
        }
    }

    render() {
        return (
            <div className='register' id='register-form'>
                <h2>Create an Account</h2>
                <form onSubmit={this.handleSubmit} method='POST' action="/users">
                    <p>Username</p>
                    <input type="text" name="username" placeholder="e.g. proudcatlady245" id="reg-username" required />
                    <p>Email</p>
                    <input type="email" name="email" placeholder="e.g. 1234@gmail.com" id="reg-email" required />
                    <p>Password</p>
                    <input type="password" name="password" id="reg-password" required />
                    <p>Confirm Password</p>
                    <input type="password" name="confirm password" id="password-confirm" required /><br />
                    <input className="button" type="submit" value="Register" id="register-btn" />
                </form>
            </div>
        );
    }
}

class LoginForm extends Component {
    handleSubmit(e) {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:3001/users",
            data: {
            username: $("#login-username").val(),
            password: $("#login-password").val()
            },
            type: "POST",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        })
            .done(function(json) {
                if(json.error === 'invalid') {
                    alert("Username/Password is invalid.");
                }
                else {
                    window.location.href = 'http://localhost:3000';
                }
            });
    }

    render() {
        return(
            <div className='login' id="login-form">
                <h2>Sign In</h2>
                <form onSubmit={this.handleSubmit} method='POST' action="/users">
                    <p>Username</p>
                    <input type="text" id="login-username" name="username" required />
                    <p>Password</p>
                    <input type="password" id="login-password" name="password" required /><br />
                    <input type="checkbox" id="remember" name="remember me" value="remember" />
                    <label htmlFor="remember me">Remember me</label><br />
                    <p id='forgot'>Forgot Password</p>
                    <input className="button" id="login-btn" type="submit" value="Sign In" />
                </form>
            </div>
        );
    }
    
}

class Login extends Component {
    static isPrivate = false

    render() {
        return (
            <div className="login-page">
                <header>
                    <h1>Prello</h1>
                </header>

                <Register />
                <LoginForm />

            </div>
        );
    }
}

export default Login;