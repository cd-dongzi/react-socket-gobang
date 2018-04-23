import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import './utils/rem'
import './styles/index.css'
import './styles/index.less'
import initReactFastclick from 'react-fastclick'
initReactFastclick()
import {Route, Switch, Redirect, HashRouter} from 'react-router-dom'

import DevTools from './devTools'
import ManMacgine from 'components/ManMachine'
import Choose from 'components/Choose'
import Login from 'components/Login'
import Battle from 'components/Battle'


const whiteList = ['/login', '/man-machine', '/']
ReactDom.render(
    <Provider store={store}>
        <HashRouter>
                <Route render={({location}) => {
                    if (!store.getState().room.mine && !whiteList.some(path => path === location.pathname)) {
                        return <Redirect to="/login"/>
                    }
                    return (
                        <div>
                            {/*<DevTools/>*/}
                            <Switch>
                                <Route path="/" exact component={Choose}/>
                                <Route path="/login" component={Login}/>
                                <Route path="/man-machine" component={ManMacgine}/>
                                <Route path="/battle" component={Battle}/>
                                <Redirect from="*" to="/404" />
                            </Switch>
                        </div>
                    )
                }}/>
        </HashRouter>
    </Provider>
, document.getElementById('app'))