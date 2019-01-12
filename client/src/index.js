// 1. Import drizzle, drizzle-react, and your contract artifacts.
import { Drizzle, generateStore } from "drizzle";
import Marketplace from "./contracts/Marketplace.json";

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

// 2. Setup the drizzle instance.
const options = { contracts: [Marketplace] };
const drizzleStore = generateStore(options);
const drizzle = new Drizzle(options, drizzleStore);


ReactDOM.render(
    <App drizzle={drizzle}/>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();