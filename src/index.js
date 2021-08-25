import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import "./i18n/i18n";
import {Provider} from "react-redux";
import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import createSagaMiddleware from "redux-saga";
import globalReducer from "./store/reducers/globalReducer";
import reportWebVitals from "./reportWebVitals";
import App from "./main/main";
import "normalize.css";
import "./index.css";
import authReducer from "./store/reducers/authReducer";
import {watchGlobal} from "./store/sagas";
import "./assets/fontIcon/opex-icon/css/opex-icon.css";

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
    global: globalReducer,
    auth: authReducer,
});


const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(sagaMiddleware),
);
const store = createStore(rootReducer, enhancer);


//const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(watchGlobal);

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={"loading"}>
            <Provider store={store}>
                <App/>
            </Provider>
        </Suspense>
    </React.StrictMode>,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals(console.log);
