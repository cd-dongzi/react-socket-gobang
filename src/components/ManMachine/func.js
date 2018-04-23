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

export const demo = obj => {
    const {ctx} = obj.state
    ctx.drawImage()
}

// 画棋子
export const drawChess = (obj, x, y, player) => {
    const {ctx, lineSize, gradSize} = obj.state
    x = lineSize + x * gradSize
    y = lineSize + y * gradSize;
    
    ctx.beginPath();
    ctx.arc(x, y, 13, 0, Math.PI*2);
    let grd = ctx.createRadialGradient(x + 2, y - 2, 13 , x + 2, y - 2, 0);
    if (player) { //我 == 黑棋 
        grd.addColorStop(0, '#0a0a0a');
        grd.addColorStop(1, '#636766');
    }else{  //电脑 == 白棋
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
export const redrawedChess = (obj) => {
    const {existChesses} = obj.state
    for (let i = 0; i < existChesses.length; i++) {
        drawChess(obj, existChesses[i].x, existChesses[i].y, existChesses[i].player);
    }
}

// 检查落子情况
export const checkChess = (obj, x, y) => {
    return new Promise( async r =>{
        let {player, allChesses, ctx, existChesses} = obj.state

        //画棋
        drawChess(obj, x, y, player);

        //记录落下的棋子
        existChesses.push({
            x: x,
            y: y,
            player: player
        })
        await obj.asyncSetState({existChesses})

        //该位置棋子置为true,证明已经存在
        allChesses[x][y] = true;

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
                    if (player) {
                        alert('我赢了')
                    }else{
                        alert('电脑赢了')
                    }
                    await obj.asyncSetState({ over: true })
                    r()
                    return 
                }
            }
        }
        r()
    })
}
// 计算机落子
export const computerDropChess = async obj => {
    const {winsCount, wins, computerWins, myWins, allChesses} = obj.state
    const {col} = obj.props
    let myScore = [], //玩家比分
        computerScore = [], // 电脑比分
        maxScore = 0; //最大比分
    

    //比分初始化
    let scoreInit = function(){
        for( let x = 0; x < col; x ++) {  
            myScore[x] = [];
            computerScore[x] = [];
            for (let y = 0; y < col; y ++) {
                myScore[x][y] = 0;
                computerScore[x][y] = 0;
            }
        }
    }
    scoreInit.call(this);

    //电脑待会落子的坐标
    let x = 0, y = 0; 

    // 基于我和电脑的每种赢法拥有的棋子来返回对应的分数
    function formatScore(o, n) { 
        if (o < 6 && o > 0) {
            let n = 10;
            for (let i = 0; i < o; i++) {
                n *= 3;
            }
            return n
        }
        return 0
    }

    // 获取没有落子的棋盘区域
    function existChess(arr) { 
        let existArr = [];
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (!arr[i][j]) {
                    existArr.push({x:i, y:j})
                }
            }
        }
        return existArr;
    }

    let exceptArr = existChess(allChesses);

    // 循环未落子区域，找出分数最大的位置
    for (let i = 0; i < exceptArr.length; i++) { 
        let o = exceptArr[i];

        // 循环所有赢的方法
        for (let k = 0; k < winsCount; k++) {

            //判断每个坐标对应的赢法是否存在
            if (wins[o.x][o.y][k]) {

                // 计算每种赢法，拥有多少棋子，获取对应分数
                // 电脑起始分数需要高一些，因为现在是电脑落子， 优先权大
                myScore[o.x][o.y] += formatScore(myWins[k-1], 10);
                computerScore[o.x][o.y] += formatScore(computerWins[k-1], 11); 
            }
        }

        //我的分数判断
        if (myScore[o.x][o.y] > maxScore) { //当我的分数大于最大分数时， 证明这个位置的是对我最有利的
            maxScore = myScore[o.x][o.y];
            x = o.x;
            y = o.y;
        }else if (myScore[o.x][o.y] === maxScore) { //当我的分数与最大分数一样时， 证明我在这两个位置下的效果一样， 所以我们应该去判断在这两个位置时，电脑方对应的分数
            if (computerScore[o.x][o.y] > computerScore[x][y]) {
                x = o.x;
                y = o.y;
            }
        }

        // 电脑分数判断， 因为是电脑落子， 所以优先权大
        if (computerScore[o.x][o.y] > maxScore) {
            maxScore = computerScore[o.x][o.y];
            x = o.x;
            y = o.y;
        }else if (computerScore[o.x][o.y] === maxScore) {
            if (myScore[o.x][o.y] > myScore[x][y]) {
                x = o.x;
                y = o.y;
            }
        }
    }
    await checkChess(obj, x, y)

    if (obj.state.over) return
    obj.setState({
        player: true
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
