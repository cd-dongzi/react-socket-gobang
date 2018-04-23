import React from 'react'
import PropTypes from 'prop-types'
import {
    drawBoard, 
    drawChess, 
    algorithmInit, 
    focusChess, 
    redrawedChess, 
    computerDropChess,
    checkChess
} from './func.js'

class Board extends React.Component {
    static propTypes = {
        col: PropTypes.number,
        type: PropTypes.string,
        nextPlayer: PropTypes.object,
        blackPlayer: PropTypes.object,
        whitePlayer: PropTypes.object,
        onChange: PropTypes.func,
        onNext: PropTypes.func,
        chesses: PropTypes.array
    }
    static defaultProps = {
        col: 15,
        type: 'J',
        chesses: []
    }
    state = {
        size: 450,
        gradSize: 30, // 每格长度
        lineSize: 15, //每根线的间隔
        scale: 1, // 当前canvas与屏幕的比例
        
        offset: { x: 0, y: 0 },

        ctx: null,
        blackChess: null,
        whiteChess: null,
        over: false, // 是否结束
        player: true, // true:黑棋  false:白棋
        // existChesses: [], // 已经落下的棋子
        chesses: [] // 已经落下的棋子
    }

    // 同步 setState
    asyncSetState (state) {
        return new Promise( r => {
            this.setState(state, r)
        })
    }
    async componentDidMount () {

        const {size, gradSize, lineSize} = this.state
        let scale = this.refs.canvas.clientWidth/this.state.size
        if (scale < 1) {
            await this.asyncSetState({ scale })
        }

        let ctx = this.refs.canvas.getContext('2d')
        await this.asyncSetState({
            ctx,
            offset: this.getoffset(this.refs.canvas)
        })
        this.init()
    }
    componentWillReceiveProps (nextProps) {
        this.setState({over: nextProps.over})
        if (!Object.is(this.props.chesses, nextProps.chesses)) {
            this.setState({
                chesses: nextProps.chesses
            }, () => {
                if (this.state.chesses.length <= 0) {
                    this.algorithmInit()
                }
                redrawedChess(this)
            })
        }
        const {nextPlayer, whitePlayer} = nextProps

        if (nextPlayer && whitePlayer) {
            this.setState({
                player: nextPlayer.userId === whitePlayer.userId ? false : true
            })
        } 
    }
    init () {
        drawBoard(this)
        this.algorithmInit()
    }
    
    // 算法初始化
    algorithmInit () {
        let data = algorithmInit(this.props.col)
        let state = this.state
        this.setState({
            ...state,
            ...data
        })
    }

    getoffset (node) {
        if (node.nodeName === 'BODY') return {x:0,y:0};
        return {
            x: node.offsetLeft + this.getoffset(node.offsetParent).x,
            y: node.offsetTop + this.getoffset(node.offsetParent).y
        }
    }
    getPos (e) {
        const {gradSize, scale} = this.state
        let posX = e.clientX - this.state.offset.x,
            posY = e.clientY - this.state.offset.y
        let x = Math.floor((posX/scale)/gradSize),
            y = Math.floor((posY/scale)/gradSize);
        return { x: x, y: y }
    }

    // 鼠标移动时触发聚焦效果, 需要前面的聚焦效果消失, 所有需要重绘canvas
    mouseMove (e) {
        const {ctx, gradSize} = this.state
        const {col} = this.props
        ctx.clearRect(0, 0, col*gradSize, col*gradSize);
        let x = this.getPos(e).x,
            y = this.getPos(e).y

        //重绘棋盘
        drawBoard(this)

        //移动聚焦效果
        focusChess(this, x, y);

        //重绘已经下好的棋子
        redrawedChess(this, 'move')
    }

    //落子实现
    async dorpChess (e) {
        let {over, player, allChesses, ctx} = this.state
        let {blackPlayer, whitePlayer, onChange, chesses, onNext, nextPlayer} = this.props
        // 判断是否结束
        if (over) return;

        let x = this.getPos(e).x,
            y = this.getPos(e).y

        //判断该棋子是否已存在
        if (allChesses[x][y]) return;

        // 检查落子情况并落子
        await checkChess(this, x, y)
        onNext && onNext(!player ? {...blackPlayer} : {...whitePlayer} )
        onChange && onChange({
            chesses: [
                { 
                    x, 
                    y,
                    type: player,
                    player: player ? {...blackPlayer} : {...whitePlayer} 
                },
                ...chesses
            ]
        })
        if (this.state.over) return
        await this.asyncSetState({player: !player})
    }
    render () {
        const {size} = this.state
        return (
            <canvas 
                width={size}  
                height={size}
                ref="canvas" 
                className={`bg-cover-all ${this.props.className}`}
                style={Object.assign({backgroundImage: `url(${require('assets/board-bg.png')})`}, this.props.style)}
                onMouseMove={e => {this.mouseMove(e)}}
                onClick={e => {this.dorpChess(e)}}
            ></canvas>
        )
    }
}

export default Board