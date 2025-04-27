const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');

let cw, ch;
let circle;
let square = null;
let direction = 1; // 1 - right, -1 - left
let gameOver = false;
let score = 0;
let fallSpeed = 4; // boshlang'ich tushish tezligi

function resize() {
    // Telefon standart o'lcham
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
        y: ch / 2, // ekranning to'g'ri o'rtasida
        radius: 20,
        speed: 5
    };
    square = createSquare();
    direction = 1;
    gameOver = false;
    score = 0;
    fallSpeed = 4;
    scoreDisplay.textContent = score;
    restartBtn.style.display = 'none';
    loop();
}


function createSquare() {
    const size = 40;
    const x = circle.x - size / 2;
    const isBonus = Math.random() < 0.4; // EHTIMOL 40% QILINDI
    return { x, y: -size, size, angle: 0, rotateSpeed: Math.random() * 0.1 + 0.05, isBonus };
}


function update() {
    if (gameOver) return;

    circle.x += circle.speed * direction;

    const PADDING = 40;
    if (circle.x - circle.radius < PADDING || circle.x + circle.radius > cw - PADDING) {
        direction *= -1;
    }

    // Update square
    square.y += fallSpeed;
    square.angle += square.rotateSpeed;

    // Collision detection
    let dx = circle.x - (square.x + square.size/2);
    let dy = circle.y - (square.y + square.size/2);
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle.radius + square.size/2) {
        if (square.isBonus) {
            // Bonus square tegdi: +10 ball
            score += 10;
            scoreDisplay.textContent = score;
            square = createSquare();
            fallSpeed += 0.2;
        } else {
            // Oddiy square tegdi: Game Over
            gameOver = true;
            restartBtn.style.display = 'block';
        }
    }

    // Square ekrandan chiqib ketganda: hech narsa qilmaymiz
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

    

    // 2. Doyira harakatlanadigan yo'l chizamiz
    drawRoad();

    // 3. Harakatlanayotgan doira (circle)
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#DD4247';
    ctx.fill();

    // 4. Tushayotgan to'rtburchak (square)
    ctx.save();
    ctx.translate(square.x + square.size/2, square.y + square.size/2);
    ctx.rotate(square.angle);
    ctx.fillStyle = square.isBonus ? '#DD4247' : '#000';
    ctx.fillRect(-square.size/2, -square.size/2, square.size, square.size);
    ctx.restore();

    // 5. Agar o'yin tugagan bo'lsa, Score textlarini ko'rsatamiz
    if (gameOver) {

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height); // canvas.width va canvas.height ishlatamiz!

        // Katta point (raqam)
        ctx.fillStyle = '#DD4247';
        ctx.font = 'bold 64px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${score}`, cw/2, ch * 0.3);

        // Kichik 'Your Score' matni
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px sans-serif';
        ctx.fillText('Your Score', cw/2, ch * 0.3 + 40);
    }
}




function loop() {
    update();
    draw();
    if (!gameOver) {
        requestAnimationFrame(loop);
    }
}

canvas.addEventListener('click', () => {
    if (!gameOver) {
        direction *= -1;
    }
});

restartBtn.addEventListener('click', resetGame);

resetGame();
