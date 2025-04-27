const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');

let cw, ch;
let circle;
let square = null;
let direction = 1; // 1 - o'ngga, -1 - chapga
let gameOver = false;
let score = 0;
let fallSpeed = 400; // sekundiga px
let lastTime = 0; // deltaTime uchun

function resize() {
    cw = 390;
    ch = 844;
    canvas.width = cw;
    canvas.height = ch;
}

window.addEventListener('resize', resize);
resize();

function resetGame() {
    circle = {
        x: cw / 2,
        y: ch / 2,
        radius: 20,
        speed: 200 // sekundiga px
    };
    square = createSquare();
    direction = 1;
    gameOver = false;
    score = 0;
    fallSpeed = 200; // boshlang'ich tushish tezligi (pixels per second)
    scoreDisplay.textContent = score;
    restartBtn.style.display = 'none';
    lastTime = performance.now(); // reset qilish
    requestAnimationFrame(gameLoop);
}

function createSquare() {
    const size = 40;
    const x = circle.x - size / 2;
    const isBonus = Math.random() < 0.4;
    return { x, y: -size, size, angle: 0, rotateSpeed: Math.random() * 1 + 0.5, isBonus };
}

function update(deltaTime) {
    if (gameOver) return;

    // Doyira harakati
    circle.x += circle.speed * direction * deltaTime;

    const PADDING = 40;
    if (circle.x - circle.radius < PADDING || circle.x + circle.radius > cw - PADDING) {
        direction *= -1;
    }

    // To'rtburchak pastga tushadi
    square.y += fallSpeed * deltaTime;
    square.angle += square.rotateSpeed * deltaTime;

    // Collision tekshirish
    let dx = circle.x - (square.x + square.size / 2);
    let dy = circle.y - (square.y + square.size / 2);
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle.radius + square.size / 2) {
        if (square.isBonus) {
            score += 10;
            scoreDisplay.textContent = score;
            square = createSquare();
            fallSpeed += 20; // har bonusdan keyin tezlashadi
        } else {
            gameOver = true;
            restartBtn.style.display = 'block';
        }
    }

    // Agar square ekrandan chiqib ketsa
    if (square.y > ch + square.size) {
        square = createSquare();
    }
}

function drawRoad() {
    const padding = 40;
    const roadHeight = (circle.radius + 10) * 2;
    const roadY = circle.y - (roadHeight / 2);
    const cornerRadius = 35;

    ctx.fillStyle = '#E2E2E2';
    ctx.beginPath();
    ctx.moveTo(padding + cornerRadius, roadY);
    ctx.lineTo(cw - padding - cornerRadius, roadY);
    ctx.quadraticCurveTo(cw - padding, roadY, cw - padding, roadY + cornerRadius);
    ctx.lineTo(cw - padding, roadY + roadHeight - cornerRadius);
    ctx.quadraticCurveTo(cw - padding, roadY + roadHeight, cw - padding - cornerRadius, roadY + roadHeight);
    ctx.lineTo(padding + cornerRadius, roadY + roadHeight);
    ctx.quadraticCurveTo(padding, roadY + roadHeight, padding, roadY + roadHeight - cornerRadius);
    ctx.lineTo(padding, roadY + cornerRadius);
    ctx.quadraticCurveTo(padding, roadY, padding + cornerRadius, roadY);
    ctx.closePath();
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, cw, ch);

    // 1. Doyira harakatlanadigan yo'l
    drawRoad();

    // 2. Harakatlanayotgan doira (circle)
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#DD4247';
    ctx.fill();

    // 3. Tushayotgan to'rtburchak (square)
    ctx.save();
    ctx.translate(square.x + square.size / 2, square.y + square.size / 2);
    ctx.rotate(square.angle);
    ctx.fillStyle = square.isBonus ? '#DD4247' : '#000';
    ctx.fillRect(-square.size / 2, -square.size / 2, square.size, square.size);
    ctx.restore();

    // 4. O'yin tugasa
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, cw, ch);

        ctx.fillStyle = '#DD4247';
        ctx.font = 'bold 64px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${score}`, cw / 2, ch * 0.3);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px sans-serif';
        ctx.fillText('Your Score', cw / 2, ch * 0.3 + 40);
    }
}

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // sekundlarga o'tkazamiz
    lastTime = currentTime;

    update(deltaTime);
    draw();

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

canvas.addEventListener('click', () => {
    if (!gameOver) {
        direction *= -1;
    }
});

restartBtn.addEventListener('click', resetGame);

resetGame();
