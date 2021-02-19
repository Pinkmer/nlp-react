import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router/router'
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './redux/store/index'

ReactDOM.render(
  <Provider store={ store }>
    <Router />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
