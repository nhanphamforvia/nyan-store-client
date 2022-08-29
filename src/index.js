import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AuthContextProvider from './context/authContext'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import allReducers from './redux/reducers/allReducers'

const store = createStore(allReducers, applyMiddleware(thunk))

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <AuthContextProvider>
                    <App />
                </AuthContextProvider>
            </Provider>
        </BrowserRouter>
    </React.StrictMode>
)
