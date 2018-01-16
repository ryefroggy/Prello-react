import React from 'react';
import {BrowserRouter, Switch} from 'react-router-dom';
import ReactDOM from 'react-dom';
import Route from './AuthRoute';
import Login from './views/login';
import Boards from './BoardsPage/boards';
import Board from './BoardPage/board';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducers';

let store = createStore(
  reducer,
  applyMiddleware(thunk)
);

// const Main = () => (
//   <main>
//     <Switch>
//       <Route exact path='/login' component={Login} />
//       <Route exact path='/' component={Boards} />
//       <Route exact path='/board/:BOARDID' component={Board} />
//     </Switch>
//   </main>
// )

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/" component={Boards} />
      <Route exact path="/board/:BOARDID" component={Board} />
    </Switch>
  </BrowserRouter>
)

ReactDOM.render ((
  <Provider store={store}>
    <App />
  </Provider>),
  document.getElementById('root')
);