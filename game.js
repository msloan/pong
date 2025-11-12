const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game state
let gameRunning = false;
let gamePaused = false;
let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 5;

// Paddles
const paddleWidth = 10;
const paddleHeight = 80;
const paddleSpeed = 5;

const player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 0,
    score: 0
};

const player2 = {
    x: canvas.width - 10 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 0,
    score: 0
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    speedX: 5,
    speedY: 5,
    speed: 5
};

// Keys state
const keys = {};

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.key] = false;
});

// Start button
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameRunning) {
        startGame();
    } else {
        gamePaused = !gamePaused;
        document.getElementById('startBtn').textContent = gamePaused ? 'Resume' : 'Pause';
    }
});

// Reset button
document.getElementById('resetBtn').addEventListener('click', () => {
    resetGame();
});

function startGame() {
    gameRunning = true;
    gamePaused = false;
    document.getElementById('startBtn').textContent = 'Pause';
    resetBall();
    gameLoop();
}

function resetGame() {
    gameRunning = false;
    gamePaused = false;
    player1Score = 0;
    player2Score = 0;
    player1.y = canvas.height / 2 - paddleHeight / 2;
    player2.y = canvas.height / 2 - paddleHeight / 2;
    updateScore();
    resetBall();
    document.getElementById('startBtn').textContent = 'Start Game';
    draw();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Random direction
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6; // -30 to 30 degrees
    ball.speedX = Math.cos(angle) * ball.speed;
    ball.speedY = Math.sin(angle) * ball.speed;
    // Randomly choose left or right
    if (Math.random() > 0.5) {
        ball.speedX = -ball.speedX;
    }
}

function updateScore() {
    document.getElementById('player1-score').textContent = player1Score;
    document.getElementById('player2-score').textContent = player2Score;
}

function updatePaddles() {
    // Player 1 controls (W/S or Arrow Up/Down)
    if ((keys['w'] || keys['ArrowUp']) && player1.y > 0) {
        player1.y -= paddleSpeed;
    }
    if ((keys['s'] || keys['ArrowDown']) && player1.y < canvas.height - paddleHeight) {
        player1.y += paddleSpeed;
    }

    // Player 2 controls (I/K)
    if (keys['i'] && player2.y > 0) {
        player2.y -= paddleSpeed;
    }
    if (keys['k'] && player2.y < canvas.height - paddleHeight) {
        player2.y += paddleSpeed;
    }
}

function updateBall() {
    if (gamePaused) return;

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top and bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Paddle collisions
    // Player 1 paddle
    if (ball.x - ball.radius <= player1.x + player1.width &&
        ball.x - ball.radius >= player1.x &&
        ball.y >= player1.y &&
        ball.y <= player1.y + player1.height) {
        ball.speedX = Math.abs(ball.speedX);
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - player1.y) / player1.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }

    // Player 2 paddle
    if (ball.x + ball.radius >= player2.x &&
        ball.x + ball.radius <= player2.x + player2.width &&
        ball.y >= player2.y &&
        ball.y <= player2.y + player2.height) {
        ball.speedX = -Math.abs(ball.speedX);
        // Add spin based on where ball hits paddle
        const hitPos = (ball.y - player2.y) / player2.height;
        ball.speedY = (hitPos - 0.5) * 10;
    }

    // Score points
    if (ball.x < 0) {
        player2Score++;
        updateScore();
        if (player2Score >= WINNING_SCORE) {
            endGame('Player 2');
            return;
        }
        resetBall();
    }
    if (ball.x > canvas.width) {
        player1Score++;
        updateScore();
        if (player1Score >= WINNING_SCORE) {
            endGame('Player 1');
            return;
        }
        resetBall();
    }
}

function endGame(winner) {
    gameRunning = false;
    gamePaused = false;
    alert(`${winner} wins!`);
    document.getElementById('startBtn').textContent = 'Start Game';
    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Draw pause message
    if (gamePaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    }
}

function gameLoop() {
    if (!gameRunning) return;

    updatePaddles();
    updateBall();
    draw();

    requestAnimationFrame(gameLoop);
}

// Initial draw
draw();

