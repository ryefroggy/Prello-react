import React from 'react';
import {BrowserRouter, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Route from './AuthRoute';
import Login from './views/login';
import Boards from './views/boards';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/' component={Boards}/>
    </Switch>
  </main>
)

const App = () => (
  <div>
    <Main />
  </div>
)

ReactDOM.render ((
  <BrowserRouter>
    <App />
  </BrowserRouter>),
  document.getElementById('root')
);