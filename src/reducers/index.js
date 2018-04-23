import { handleActions } from 'redux-actions'
import { combineReducers } from 'redux'

const ctx = handleActions({
    CREATE_CTX: (state, action) => action.payload
}, null)

const initRoomData = {
    mine: null,
    users: [],
    msgs: [],
    myMsgs: [],
    chesses: [],
    players: [],
    nextPlayar: null,
    leavePlayer: null,
    over: false,
    winner: null,
    isPopupRes: false,
    nextLeaveUser: null
}
const room = handleActions({
    NEW_USER: (state, action) => {
    	state.mine = action.payload
    	return {...state}
    },
    REMOVE_USER: (state, action) => {
        state.nextLeaveUser = action.payload
        return {...state}
    },
    GET_USER_LIST: (state, action) => {
    	state.users = action.payload
    	return {...state}
    },
    GET_MSG_LIST: (state, action) => {
    	state.msgs = action.payload
    	return {...state}
    },
    GET_CHESSES_LIST: (state, action) => {
        state.chesses = action.payload
        return {...state}
    },
    GET_PLAYERS: (state, action) => {
        state.players = action.payload
        return {...state}
    },
    GET_NEXT_PLAYER: (state, action) => {
        state.nextPlayar = action.payload
        return {...state}
    },
    GET_OVER_STATUS: (state, action) => {
        state.over = true
        state.winner = action.payload
        return {...state}
    },
    POPUP_RES: state => {
        state.isPopupRes = true
        return {...state}
    },
    INIIT_BOARD: (state, action) => {
        state.leavePlayer = action.payload.user
        state.players = action.payload.players
        state.nextPlayar = null
        state.over = false
        state.chesses = []
        return {...state}
    },
    AGAIN_PLAY: state => {
        state.over = false
        state.nextPlayar = null
        state.chesses = []
        state.players = []
        return {...state}
    },
    CLEAR_ROOM: state => ({...initRoomData})
}, {...initRoomData})

export default combineReducers({
    room,
    ctx
})
