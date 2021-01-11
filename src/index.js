import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/stable';
import 'core-js';
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// context imports
import { UserContext } from './context/UserContext'
import { FetchContext } from './context/FetchContext'

import { icons } from './assets/icons'

import { Provider } from 'react-redux'
import store from './store'

React.icons = icons

ReactDOM.render(
  <Provider store={store}>
    <FetchContext>
      <UserContext>
        <App />
      </UserContext>
    </FetchContext>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
