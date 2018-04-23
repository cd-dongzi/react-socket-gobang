import socket from 'socket.io-client'
import store from '../store'
import Context from './socket-client'
const url = 'ws://localhost:3000'

export const ctx = new Context(socket, url, store)


import { createAction } from 'redux-actions'
export const createCtx = createAction('CREATE_CTX')
export const popupRes = createAction('POPUP_RES')
export const clearRoom = createAction('CLEAR_ROOM')
export default {
    createCtx,
    popupRes,
    clearRoom
}
