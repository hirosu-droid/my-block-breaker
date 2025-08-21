// --- 初期設定 ---
// --- 初期設定 ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- ゲームの変数 ---
// ボールのプロパティ
let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2; // X方向の速度
let dy = -2; // Y方向の速度

// パドルのプロパティ
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// キー操作の状態
let rightPressed = false;
let leftPressed = false;

// ブロックのプロパティ
let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

// スコアとライフ
let score = 0;
let lives = 3;

// ブロックの配列を初期化
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 }; // status: 1 = 表示, 0 = 破壊済み
    }
}

// --- イベントリスナー ---
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    // マウスの位置をキャンバスの左端からの相対位置で計算
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        // パドルがキャンバスの範囲内に収まるように位置を調整
        paddleX = relativeX - paddleWidth / 2;
        if (paddleX < 0) {
            paddleX = 0;
        }
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
}

// --- 描画関数 ---

// ボールを描画する関数
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#4f46e5";
    ctx.fill();
    ctx.closePath();
}

// パドルを描画する関数
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#1e40af";
    ctx.fill();
    ctx.closePath();
}

// ブロックを描画する関数
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#3b82f6";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// スコアを描画する関数
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#1e3a8a";
    ctx.fillText("スコア: " + score, 8, 20);
}

// ライフを描画する関数
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#1e3a8a";
    ctx.fillText("ライフ: " + lives, canvas.width - 70, 20);
}

// --- 衝突検出 ---
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                // ボールがブロックに当たったか判定
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy; // Y方向の速度を反転
                    b.status = 0; // ブロックを破壊済みにする
                    score++;
                    // 全てのブロックを破壊したかチェック
                    if (score == brickRowCount * brickColumnCount) {
                        alert("クリアおめでとう！");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// --- メインのゲームループ ---
function draw() {
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 各要素を描画
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    // ボールの壁との衝突判定
    // 左右の壁
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    // 上の壁
    if (y + dy < ballRadius) {
        dy = -dy;
    } 
    // 下の壁（パドルとの衝突判定も含む）
    else if (y + dy > canvas.height - ballRadius) {
        // パドルに当たった場合
        if (x > paddleX && x < paddleX + paddleWidth) {
            // パドルに当たるたびにボールの速度を少しずつ速くする
            dy = -dy * 1.05;
            dx = dx * 1.05;
        } else {
            // パドルに当たらなかった場合（ゲームオーバー）
            lives--;
            if (!lives) {
                alert("ゲームオーバー");
                document.location.reload();
            } else {
                // ボールとパドルを初期位置に戻す
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    // ボールの位置を更新
    x += dx;
    y += dy;

    // 次のフレームを要求
    requestAnimationFrame(draw);
}

// ゲームを開始
draw();
