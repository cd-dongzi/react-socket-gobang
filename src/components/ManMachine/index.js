import React from 'react'
import Board from './board'
export default class extends React.Component {
    state = {
        again: false
    }
    render () {
        return (
            <div className="board-container">
                <h1 style={{textAlign: 'center', marginTop: '20px'}}>五子棋人机大战</h1>
                <div className="board-wrapper" style={{margin: '20px auto'}}>
                    <Board again={this.state.again}/>
                </div>
                <div className="btns df-sa">
                    <button className="btn" onClick={() => { this.props.history.push('/') }}>退出</button>
                    <button className="btn" onClick={() => { this.setState({again: true}) }}>重新开始</button>
                </div>
            </div>
        )
    }
}