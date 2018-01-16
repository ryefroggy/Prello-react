import React, { Component } from 'react';
import { AppRegistry, Button, TextInput, Text, View, StyleSheet } from 'react-native';
import $ from 'jquery';

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
            });
        }
    }

    render() {
        return (
            <View style={styles.registration} className='register' id='register-form'>
                <Text>Create an Account</Text>
                <View>
                    <Text>Username</Text>
                    <TextInput name="username" placeholder="e.g. proudcatlady245" id="reg-username" required />
                    <Text>Email</Text>
                    <TextInput keyboardType="email-address" name="email" placeholder="e.g. 1234@gmail.com" id="reg-email" required />
                    <Text>Password</Text>
                    <TextInput secureTextEntry={true} name="password" id="reg-password" required />
                    <Text>Confirm Password</Text>
                    <TextInput secureTextEntry={true} name="confirm password" id="password-confirm" required />
                    <Button onPress={this.handleSubmit} title="Register" color="#0B80C5" />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    registration: {
        backgroundColor: '#58A842'
    },
    header: {
        margin: 0,
        backgroundColor: '#0B80C5'
    },
    headerText: {
        textAlign: 'center',
        padding: '2%',
        color: '#FDFEFE',
        margin: 0,
        fontSize: 50
    },
    h2: {
       padding: '2%',
       color: 'white', 
    }
});

// class LoginForm extends Component {
//     handleSubmit(e) {
//         e.preventDefault();
//         $.ajax({
//             url: "http://localhost:3001/users",
//             data: {
//             username: $("#login-username").val(),
//             password: $("#login-password").val()
//             },
//             type: "POST",
//             dataType: "json",
//             xhrFields: {
//                 withCredentials: true
//             }
//         })
//             .done(function(json) {
//                 if(json.error === 'invalid') {
//                     alert("Username/Password is invalid.");
//                 }
//                 else {
//                     window.location.href = 'http://localhost:3000';
//                 }
//             });
//     }

//     render() {
//         return(
//             <div className='login' id="login-form">
//                 <h2>Sign In</h2>
//                 <form onSubmit={this.handleSubmit} method='POST' action="/users">
//                     <p>Username</p>
//                     <input type="text" id="login-username" name="username" required />
//                     <p>Password</p>
//                     <input type="password" id="login-password" name="password" required /><br />
//                     <input type="checkbox" id="remember" name="remember me" value="remember" />
//                     <label htmlFor="remember me">Remember me</label><br />
//                     <p id='forgot'>Forgot Password</p>
//                     <input className="button" id="login-btn" type="submit" value="Sign In" />
//                 </form>
//             </div>
//         );
//     }
    
// }

class Login extends Component {
    static isPrivate = false

    render() {
        return (
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerText}>Prello</Text>
                </View>

                <Register />
                {/* <LoginForm /> */}

            </View>
        );
    }
}

export default Login;

AppRegistry.registerComponent(
    'Prello',
    () => Login
);