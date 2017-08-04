import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';
import $ from 'jquery';

const isAuthenticated = () => {
    // return fetch('http://localhost:3000/users', {
    //     method: "GET",
    //     headers: {
    //         "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     credentials: "include"
    // })
    //     .then(function(response) {
    //         return response.json();
    //     })
    //     .then(function(json) {
    //         console.log(json);
    //         if(!json.username) {
    //             console.log("false");
    //             return false;
    //         }
    //         else {
    //             return true;
    //         }
    //     });
    var auth;
    $.ajax({
        url: 'http://localhost:3000/users',
        type: 'GET',
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false
    })
        .done(function(json) {
            if(json.username) {
                auth = true;
            }
            else {
                auth = false;
            }
        });
    return auth;
}

const AuthRoute = ({component, ...props}) => {
    const {isPrivate} = component;
    if (isAuthenticated()) {
        if(isPrivate === true) {
            return <Route {...props} component={component} />;
        }
        else {
            return <Redirect to={'/'} />;
        }
    }
    else {
        if(isPrivate === true) {
            return <Redirect to={'/login'} />;
        }
        else {
            return <Route {...props} component={component} />;
        }
    }
};

AuthRoute.propTypes = {
    component: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.func
    ])
};

export default AuthRoute;