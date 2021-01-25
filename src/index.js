import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as tractjs from "tractjs";

const model_path = "model/example.onnx";


function rURL(src) {
    // this makes sure it works both locally and on gh-pages
    return window.location.href.replace(/\/$/, "") + "/" + src;
}


tractjs.load(rURL(model_path)).then((model) => {
    ReactDOM.render(
        <React.StrictMode>
            <App model={model}/>
        </React.StrictMode>,
        document.getElementById('root')
    );
});



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
