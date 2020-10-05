let canvas;
let ctx;

// paddle positions
let p1x, p2x, p1y, p2y;
// ball position and velocity
let ballX, ballY, ballVelX, ballVelY;

let p1UpPressed, p1DownPressed, p2UpPressed, p2DownPressed;

// scores
let p1ScoreEl = document.querySelector("#score-1");
let p2ScoreEl = document.querySelector("#score-2");
let p1Score = 0;
let p2Score = 0;

// starting ball direction
let ballStartsLeft;

const PADDLE_HEIGHT = 80;
const BALL_HEIGHT = 5;

window.onload = function () {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");

    setInitialPositions();

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);

    updateScore();

    this.requestAnimationFrame(draw);
};

function draw() {
    // set bg color
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // move paddles
    if (p1UpPressed && p1y >= 0) {
        p1y -= 7;
    } else if (p1DownPressed && p1y < canvas.height - PADDLE_HEIGHT) {
        p1y += 7;
    }

    if (p2UpPressed && p2y >= 0) {
        p2y -= 7;
    } else if (p2DownPressed && p2y < canvas.height - PADDLE_HEIGHT) {
        p2y += 7;
    }
    // player 1
    drawPaddle(p1x, p1y);
    // player 2
    drawPaddle(p2x, p2y);

    // bounce off top or bottom
    if (ballY <= 5 || ballY >= canvas.height - BALL_HEIGHT) {
        ballVelY = ballVelY * -1;
    }

    // bounce off paddle
    const hitsPaddle1 =
        ballX <= p1x + 5 &&
        ballX >= p1x + 3 &&
        ballY <= p1y + PADDLE_HEIGHT &&
        ballY >= p1y;
    const hitsPaddle2 =
        ballX >= p2x - 5 &&
        ballX <= p2x - 3 &&
        ballY <= p2y + PADDLE_HEIGHT &&
        ballY >= p2y;
    if (hitsPaddle1 || hitsPaddle2) {
        ballVelX = ballVelX * -1;

        // location of the paddle that the ball hit (ranging from -0.5 to 0.5, -0.5 being top )
        let hitPaddleLoc;
        if (hitsPaddle1) {
            hitPaddleLoc = (ballY - p1y) / PADDLE_HEIGHT - 0.5;
        }
        if (hitsPaddle2) {
            hitPaddleLoc = (ballY - p2y) / PADDLE_HEIGHT - 0.5;
        }
        ballVelY += hitPaddleLoc * -4;
    }

    const hitsWall1 = ballX <= 0;
    const hitsWall2 = ballX >= canvas.width;
    if (hitsWall1 || hitsWall2) {
        if (hitsWall1) {
            p2Score++;
        }
        if (hitsWall2) {
            p1Score++;
        }

        updateScore();
        setInitialPositions();

        setTimeout(() => requestAnimationFrame(draw), 1000);
        return;
    }

    ballX += ballVelX;
    ballY -= ballVelY;

    drawBall(ballX, ballY);

    requestAnimationFrame(draw);
}

function onKeydown(e) {
    switch (e.keyCode) {
        case 38:
            e.preventDefault();
            p2UpPressed = true;
            break;
        case 40:
            e.preventDefault();
            p2DownPressed = true;
            break;
        case 87:
            p1UpPressed = true;
            break;
        case 83:
            p1DownPressed = true;
            break;
    }
}

function onKeyup(e) {
    switch (e.keyCode) {
        case 38:
            e.preventDefault();
            p2UpPressed = false;
            break;
        case 40:
            e.preventDefault();
            p2DownPressed = false;
            break;
        case 87:
            p1UpPressed = false;
            break;
        case 83:
            p1DownPressed = false;
            break;
    }
}

function setInitialPositions() {
    ballStartsLeft = !ballStartsLeft;

    p1y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    p2y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    p1x = 20;
    p2x = canvas.width - 25;

    ballX = canvas.width / 2 - BALL_HEIGHT;
    ballY = canvas.height / 2 - BALL_HEIGHT;
    ballVelX = 3 * (ballStartsLeft ? -1 : 1);
    ballVelY = 2;
}

function drawPaddle(x, y) {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(x, y, 5, PADDLE_HEIGHT);
}

function drawBall(x, y) {
    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(x, y, BALL_HEIGHT, 0, 2 * Math.PI);
    ctx.fill();
}

function updateScore() {
    p1ScoreEl.innerHTML = p1Score;
    p2ScoreEl.innerHTML = p2Score;
}
