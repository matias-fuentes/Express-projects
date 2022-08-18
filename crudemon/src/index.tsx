import React from 'react';
import ReactDOM from 'react-dom/client';
import './normalize.css';
import './globals.css';
import App from './App';

// Redux-related
import store from './redux/store';
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
