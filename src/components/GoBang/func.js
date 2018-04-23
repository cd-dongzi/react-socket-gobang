// 画棋盘
export const drawBoard = obj => {
    const {ctx, lineSize, gradSize} = obj.state
    const {col} = obj.props
    ctx.strokeStyle = "#bfbfbf";
    for (let i = 0; i < col; i++) {
        ctx.moveTo(lineSize+gradSize*i, lineSize);
        ctx.lineTo(lineSize+gradSize*i, col*gradSize-lineSize);
        ctx.stroke();
        ctx.moveTo(lineSize, lineSize+gradSize*i);
        ctx.lineTo(col*gradSize-lineSize, lineSize+gradSize*i);
        ctx.stroke();
    }
}


// 画棋子
export const drawChess = (obj, x, y, type) => {
    const {ctx, lineSize, gradSize} = obj.state
    x = lineSize + x * gradSize
    y = lineSize + y * gradSize;
    
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI*2);
    let grd = ctx.createRadialGradient(x + 2, y - 2, 13 , x + 2, y - 2, 0);

    if (type) { //黑棋 
        grd.addColorStop(0, '#0a0a0a');
        grd.addColorStop(1, '#636766');
    }else{  //白棋
        grd.addColorStop(0, '#d1d1d1');
        grd.addColorStop(1, '#f9f9f9');
    }
    ctx.fillStyle = grd;
    ctx.fill()
}


//鼠标移动聚焦
export const focusChess = (obj, x, y) => {
    const {ctx} = obj.state
    ctx.beginPath();
    ctx.fillStyle = '#E74343';
    ctx.arc(15 + x * 30, 15 + y * 30, 6, 0, Math.PI*2);
    ctx.fill();
}

// 重绘棋子
export const redrawedChess = (obj, type) => {
    const {chesses, ctx, size} = obj.state
    if (type === 'move') {
        for (let i = 0; i < chesses.length; i++) {
            drawChess(obj, chesses[i].x, chesses[i].y, chesses[i].type)
        }
    }else{
        let allChesses = []
        for (let x = 0; x < obj.props.col; x++) {
            allChesses[x] = []
            for (let y = 0; y < obj.props.col; y++) {
                allChesses[x][y] = false
            }
        }
        //重绘棋盘
        ctx.clearRect(0, 0, size, size)
        drawBoard(obj)
        for (let i = 0; i < chesses.length; i++) {
            drawChess(obj, chesses[i].x, chesses[i].y, chesses[i].type)
            //该位置棋子置为true,证明已经存在
            allChesses[chesses[i].x][chesses[i].y] = true
        }
        obj.setState({ allChesses })
    }
    
}

// 检查落子情况
export const checkChess = (obj, x, y) => {
    return new Promise( async r =>{
        let {player, allChesses, ctx, existChesses} = obj.state
        let {blackPlayer, whitePlayer} = obj.props

        //画棋
        drawChess(obj, x, y, player);

        await currWinChesses(obj, x, y);
        r()
    })
}

//判断当前坐标赢的方法各自拥有几粒棋子
export const currWinChesses = (obj, x, y) => {
    return new Promise( async r => {
        let {player, myWins, computerWins, winsCount, wins} = obj.state
        let currObj = player ? myWins : computerWins;
        let enemyObj = player ? computerWins : myWins;
        for (let i = 1; i <= winsCount; i++) {
            if (wins[x][y][i]) { //因为赢法统计是从1开始的  所以对应我的赢法需要减1
                currObj[i-1] ++;  // 每个经过这个点的赢法都增加一个棋子;

                enemyObj[i-1] = 6; //这里我下好棋了,证明电脑不可能在这种赢法上取得胜利了， 置为6就永远不会到5

                if (currObj[i-1] === 5) { //当达到 5 的时候,证明我胜利了
                    let {blackPlayer, whitePlayer, onWinner} = obj.props
                    let currPlayer = player ? blackPlayer : whitePlayer
                    onWinner && onWinner(currPlayer)
                    await obj.asyncSetState({ over: true })
                    r()
                    return 
                }
            }
        }
        r()
    })
}
// 各种赢法初始化
export const algorithmInit = col => {
    let allChesses = [],
        wins = [],
        winsCount = 0,
        myWins = [],
        computerWins = []

    //初始化棋盘的每个位置和赢法
    for (let x = 0; x < col; x++) {
        allChesses[x] = [];
        wins[x] = [];
        for (let y = 0; y < col; y++) {
            allChesses[x][y] = false;
            wins[x][y] = [];
        }
    }


    // 获取所有赢法
    for (let x = 0; x < col; x++) { //纵向所有赢法 总共15 * 11种
        for (let y = 0; y < col-4; y ++) {
            winsCount ++; 
            //以下for循环给每种赢法的位置信息储存起来
            for (let k = 0; k < 5; k ++) {
                wins[x][y+k][winsCount] = true;
            }
        }
    }
    for (let y = 0; y < col; y++) { //横向所有赢法, 同纵向赢法一样，也是15 * 11种
        for (let x = 0; x < col-4; x ++) {
            winsCount ++;
            for (let k = 0; k < 5; k ++) {
                wins[x+k][y][winsCount] = true;
            }
        }
    }
    for (let x = 0; x < col-4; x++) { // 左 -> 右 开始的所有交叉赢法  总共11 * 11种
        for (let y = 0; y < col-4; y ++) {
            winsCount ++;
            for (let k = 0; k < 5; k ++) {
                wins[x+k][y+k][winsCount] = true;
            }
        }
    }
    for (let x = col-1; x >= 4; x --) { //右 -> 左 开始的所有交叉赢法  总共11 * 11种
        for (let y = 0; y < col-4; y ++) {
            winsCount ++;
            for (let k = 0; k < 5; k ++) {
                wins[x-k][y+k][winsCount] = true;
            }
        }
    }

    // 初始化电脑和我每个赢法当前拥有的棋子数
    for (let i = 0; i < winsCount; i++) {
        myWins[i] = 0;
        computerWins[i] = 0;
    }

    return {
        allChesses,
        wins,
        winsCount,
        myWins,
        computerWins
    }
}
