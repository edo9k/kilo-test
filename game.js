const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const finalScoreDisplay = document.getElementById('final-score');

canvas.width = 800;
canvas.height = 450;

const TILE_SIZE = 32;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const MAX_SPEED = 6;

let gameState = 'start';
let score = 0;
let highScore = localStorage.getItem('pixelRunnerHighScore') || 0;
let cameraX = 0;
let distance = 0;

highScoreDisplay.textContent = 'Best: ' + highScore + 'm';

const keys = {
    left: false,
    right: false,
    jump: false
};

const player = {
    x: 100,
    y: 300,
    width: 28,
    height: 40,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    animFrame: 0,
    animTimer: 0
};

let platforms = [];
let enemies = [];
let coins = [];
let particles = [];
let clouds = [];
let bgTiles = [];

function initGame() {
    score = 0;
    distance = 0;
    cameraX = 0;
    player.x = 100;
    player.y = 300;
    player.vx = 0;
    player.vy = 0;
    player.onGround = false;
    player.facing = 1;
    platforms = [];
    enemies = [];
    coins = [];
    particles = [];
    clouds = [];
    bgTiles = [];

    for (let i = 0; i < 50; i++) {
        bgTiles.push({
            x: i * TILE_SIZE * 2,
            y: 300 + Math.random() * 100,
            type: Math.random() > 0.5 ? 'bush' : 'rock'
        });
    }

    generateTerrain(0, 200);
}

function generateTerrain(startX, length) {
    for (let i = startX; i < startX + length; i++) {
        const x = i * TILE_SIZE;
        const variation = Math.sin(i * 0.3) * 50 + Math.sin(i * 0.7) * 30;
        const groundY = 350 + variation;

        if (i % 15 === 0 && i > 20) {
            platforms.push({
                x: x,
                y: groundY - 80,
                width: TILE_SIZE * 4,
                height: TILE_SIZE,
                type: 'floating'
            });
            if (Math.random() > 0.5) {
                coins.push({
                    x: x + TILE_SIZE * 2,
                    y: groundY - 110,
                    size: 12,
                    collected: false
                });
            }
        }

        if (i % 25 === 0 && i > 30) {
            enemies.push({
                x: x + TILE_SIZE * 2,
                y: groundY - 30,
                width: 28,
                height: 28,
                vx: -1,
                alive: true,
                animFrame: 0
            });
        }

        if (i % 40 === 0 && i > 40) {
            const gapWidth = Math.floor(Math.random() * 3) + 2;
            for (let j = 0; j < gapWidth; j++) {
                platforms.push({
                    x: x + j * TILE_SIZE,
                    y: groundY + 200,
                    width: TILE_SIZE,
                    height: TILE_SIZE * 5,
                    type: 'pit_edge'
                });
            }
        }
    }
}

function update() {
    for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life--;
    }
    particles = particles.filter(p => p.life > 0);

    if (gameState !== 'playing') return;

    if (keys.left) {
        player.vx = Math.max(player.vx - 0.8, -MAX_SPEED);
        player.facing = -1;
    } else if (keys.right) {
        player.vx = Math.min(player.vx + 0.8, MAX_SPEED);
        player.facing = 1;
    } else {
        player.vx *= 0.85;
    }

    if (keys.jump && player.onGround) {
        player.vy = JUMP_FORCE;
        player.onGround = false;
        playSound('jump');
    }

    player.vy += GRAVITY;
    player.x += player.vx;
    player.y += player.vy;

    player.animTimer++;
    if (player.animTimer > 8) {
        player.animTimer = 0;
        player.animFrame = (player.animFrame + 1) % 4;
    }

    const groundY = getGroundHeight(player.x);
    if (player.y + player.height >= groundY && player.vy >= 0) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.onGround = true;
    }

    if (player.y > canvas.height + 100) {
        gameOver();
    }

    for (let platform of platforms) {
        if (platform.type === 'floating') {
            if (player.x + player.width > platform.x &&
                player.x < platform.x + platform.width &&
                player.y + player.height > platform.y &&
                player.y + player.height < platform.y + platform.height + 20 &&
                player.vy >= 0) {
                player.y = platform.y - player.height;
                player.vy = 0;
                player.onGround = true;
            }
        }
    }

    for (let enemy of enemies) {
        if (!enemy.alive) continue;
        enemy.x += enemy.vx;
        enemy.animFrame = (enemy.animFrame + 0.1) % 2;

        if (player.x + player.width > enemy.x &&
            player.x < enemy.x + enemy.width &&
            player.y + player.height > enemy.y &&
            player.y < enemy.y + enemy.height) {
            if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y) {
                enemy.alive = false;
                player.vy = -8;
                playSound('stomp');
                for (let i = 0; i < 8; i++) {
                    particles.push({
                        x: enemy.x + enemy.width/2,
                        y: enemy.y + enemy.height/2,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 30,
                        color: '#FF6B6B'
                    });
                }
            } else {
                gameOver();
            }
        }
    }

    for (let coin of coins) {
        if (coin.collected) continue;
        coin.animAngle = (coin.animAngle || 0) + 0.1;
        if (player.x + player.width > coin.x - coin.size &&
            player.x < coin.x + coin.size &&
            player.y + player.height > coin.y - coin.size &&
            player.y < coin.y + coin.size) {
            coin.collected = true;
            score += 50;
            playSound('coin');
            for (let i = 0; i < 6; i++) {
                particles.push({
                    x: coin.x,
                    y: coin.y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 20,
                    color: '#FFD700'
                });
            }
        }
    }

    for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.life--;
    }
    particles = particles.filter(p => p.life > 0);

    for (let cloud of clouds) {
        cloud.x -= cloud.speed;
        if (cloud.x < -200) {
            cloud.x = canvas.width + 200 + Math.random() * 400;
            cloud.y = 30 + Math.random() * 80;
        }
    }

    const maxX = player.x + canvas.width / 2;
    if (maxX > cameraX + canvas.width / 2) {
        cameraX = maxX - canvas.width / 2;
    }

    distance = Math.floor(player.x / 100);
    scoreDisplay.textContent = 'Distance: ' + distance + 'm';

    if (distance > highScore) {
        highScore = distance;
        highScoreDisplay.textContent = 'Best: ' + highScore + 'm';
    }

    const platformsEnd = platforms.length > 0 ?
        Math.max(...platforms.map(p => p.x)) : 0;
    if (player.x > platformsEnd - 500) {
        generateTerrain(Math.floor(player.x / TILE_SIZE) + 20, 50);
    }

    clouds = clouds.filter(c => c.x > -300);
    if (clouds.length < 5 && Math.random() < 0.02) {
        clouds.push({
            x: canvas.width + cameraX + 200,
            y: 30 + Math.random() * 80,
            width: 60 + Math.random() * 80,
            speed: 0.3 + Math.random() * 0.5
        });
    }
}

function getGroundHeight(x) {
    for (let platform of platforms) {
        if (x >= platform.x && x < platform.x + platform.width) {
            if (platform.type === 'pit_edge') {
                return platform.y;
            }
            return 350 + Math.sin(x / TILE_SIZE * 0.3) * 50 + Math.sin(x / TILE_SIZE * 0.7) * 30;
        }
    }
    return 350 + Math.sin(x / TILE_SIZE * 0.3) * 50 + Math.sin(x / TILE_SIZE * 0.7) * 30;
}

function draw() {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let cloud of clouds) {
        drawCloud(cloud.x - cameraX * 0.3, cloud.y, cloud.width);
    }

    ctx.save();
    ctx.translate(-cameraX, 0);

    for (let tile of bgTiles) {
        const screenX = tile.x - cameraX * 0.5;
        if (screenX > -100 && screenX < canvas.width + 100) {
            if (tile.type === 'bush') {
                drawBush(tile.x, tile.y);
            } else {
                drawRock(tile.x, tile.y);
            }
        }
    }

    for (let platform of platforms) {
        if (platform.x + platform.width > cameraX - 100 &&
            platform.x < cameraX + canvas.width + 100) {
            if (platform.type === 'floating') {
                drawFloatingPlatform(platform.x, platform.y, platform.width);
            } else {
                drawGround(platform.x, platform.y, platform.width, platform.height);
            }
        }
    }

    for (let enemy of enemies) {
        if (!enemy.alive) continue;
        if (enemy.x > cameraX - 50 && enemy.x < cameraX + canvas.width + 50) {
            drawEnemy(enemy.x, enemy.y, enemy.animFrame);
        }
    }

    for (let coin of coins) {
        if (coin.collected) continue;
        if (coin.x > cameraX - 20 && coin.x < cameraX + canvas.width + 20) {
            drawCoin(coin.x, coin.y, coin.animAngle || 0);
        }
    }

    for (let p of particles) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }

    drawPlayer(player.x, player.y, player.facing, player.animFrame);

    ctx.restore();

    requestAnimationFrame(() => {
        update();
        draw();
    });
}

function drawPlayer(x, y, facing, frame) {
    ctx.save();
    ctx.translate(x + player.width/2, y + player.height/2);
    if (facing === -1) ctx.scale(-1, 1);

    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(-10, -18, 20, 36);

    ctx.fillStyle = '#FFE4C4';
    ctx.fillRect(-8, -20, 16, 10);

    ctx.fillStyle = '#000';
    ctx.fillRect(2, -18, 3, 3);

    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-10, -4, 20, 4);

    if (Math.abs(player.vx) > 0.5) {
        const legOffset = Math.sin(frame * Math.PI / 2) * 4;
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(-8, 8 + legOffset, 6, 10);
        ctx.fillRect(2, 8 - legOffset, 6, 10);
    } else {
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(-8, 8, 6, 10);
        ctx.fillRect(2, 8, 6, 10);
    }

    ctx.fillStyle = '#FFD700';
    if (Math.abs(player.vx) > 0.5) {
        ctx.fillRect(-12, -2 + Math.sin(frame * Math.PI) * 2, 4, 3);
        ctx.fillRect(8, -2 - Math.sin(frame * Math.PI) * 2, 4, 3);
    } else {
        ctx.fillRect(-12, -2, 4, 3);
        ctx.fillRect(8, -2, 4, 3);
    }

    ctx.restore();
}

function drawGround(x, y, width, height) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = '#228B22';
    ctx.fillRect(x, y, width, 8);

    for (let i = 0; i < width; i += TILE_SIZE) {
        ctx.fillStyle = '#654321';
        ctx.fillRect(x + i + 4, y + 12, 4, 4);
        ctx.fillRect(x + i + 16, y + 20, 4, 4);
        ctx.fillRect(x + i + 24, y + 14, 3, 3);
    }

    ctx.fillStyle = '#654321';
    for (let i = 0; i < width; i += TILE_SIZE) {
        ctx.fillRect(x + i, y + height - 8, TILE_SIZE, 8);
    }
}

function drawFloatingPlatform(x, y, width) {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, width, TILE_SIZE);

    ctx.fillStyle = '#228B22';
    ctx.fillRect(x, y, width, 6);

    ctx.fillStyle = '#654321';
    for (let i = 0; i < width; i += TILE_SIZE) {
        ctx.fillRect(x + i + 2, y + 10, 4, 4);
        ctx.fillRect(x + i + 16, y + 16, 3, 3);
    }

    ctx.fillStyle = '#A0522D';
    ctx.fillRect(x, y + TILE_SIZE - 4, width, 4);
}

function drawEnemy(x, y, frame) {
    ctx.fillStyle = '#FF4444';
    ctx.fillRect(x, y, 28, 28);

    ctx.fillStyle = '#000';
    ctx.fillRect(x + 4, y + 6, 6, 6);
    ctx.fillRect(x + 18, y + 6, 6, 6);

    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 6, y + 8, 2, 2);
    ctx.fillRect(x + 20, y + 8, 2, 2);

    ctx.fillStyle = '#000';
    ctx.fillRect(x + 8, y + 18, 4, 3);
    ctx.fillRect(x + 16, y + 18, 4, 3);

    if (Math.floor(frame) === 1) {
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(x - 4, y + 10, 6, 6);
        ctx.fillRect(x + 26, y + 10, 6, 6);
    } else {
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(x - 2, y + 12, 4, 4);
        ctx.fillRect(x + 26, y + 12, 4, 4);
    }
}

function drawCoin(x, y, angle) {
    const scaleX = Math.abs(Math.cos(angle));
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x - 6 * scaleX, y - 6, 12 * scaleX, 12);

    if (scaleX > 0.3) {
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(x - 3 * scaleX, y - 3, 6 * scaleX, 6);
    }
}

function drawCloud(x, y, width) {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(x, y, width * 0.25, 0, Math.PI * 2);
    ctx.arc(x + width * 0.25, y - 5, width * 0.3, 0, Math.PI * 2);
    ctx.arc(x + width * 0.5, y, width * 0.25, 0, Math.PI * 2);
    ctx.fill();
}

function drawBush(x, y) {
    ctx.fillStyle = '#228B22';
    ctx.fillRect(x, y, 40, 20);
    ctx.fillStyle = '#32CD32';
    ctx.fillRect(x + 5, y - 5, 30, 10);
    ctx.fillRect(x + 10, y - 10, 20, 10);
}

function drawRock(x, y) {
    ctx.fillStyle = '#696969';
    ctx.fillRect(x, y, 30, 20);
    ctx.fillStyle = '#808080';
    ctx.fillRect(x + 5, y - 5, 20, 10);
    ctx.fillRect(x + 10, y - 8, 10, 8);
}

function gameOver() {
    gameState = 'gameover';
    playSound('hit');
    finalScoreDisplay.textContent = 'Distance: ' + distance + 'm';
    gameOverScreen.style.display = 'flex';

    if (distance > highScore) {
        highScore = distance;
        localStorage.setItem('pixelRunnerHighScore', highScore);
        highScoreDisplay.textContent = 'Best: ' + highScore + 'm';
    }
}

function startGame() {
    initGame();
    gameState = 'playing';
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    update();
    draw();
}

function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        switch(type) {
            case 'jump':
                oscillator.frequency.value = 400;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                oscillator.stop(audioCtx.currentTime + 0.1);
                break;
            case 'coin':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.1;
                oscillator.start();
                oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                oscillator.stop(audioCtx.currentTime + 0.15);
                break;
            case 'stomp':
                oscillator.frequency.value = 200;
                gainNode.gain.value = 0.15;
                oscillator.type = 'square';
                oscillator.start();
                oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
                oscillator.stop(audioCtx.currentTime + 0.15);
                break;
            case 'hit':
                oscillator.frequency.value = 150;
                gainNode.gain.value = 0.2;
                oscillator.type = 'sawtooth';
                oscillator.start();
                oscillator.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                oscillator.stop(audioCtx.currentTime + 0.3);
                break;
        }
    } catch(e) {
        console.log('Audio not supported');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') keys.jump = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') keys.jump = false;
});

document.getElementById('btn-left').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.left = true;
});
document.getElementById('btn-left').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.left = false;
});
document.getElementById('btn-right').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.right = true;
});
document.getElementById('btn-right').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.right = false;
});
document.getElementById('btn-jump').addEventListener('touchstart', (e) => {
    e.preventDefault();
    keys.jump = true;
});
document.getElementById('btn-jump').addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.jump = false;
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

startScreen.addEventListener('click', (e) => {
    if (e.target === startScreen) startGame();
});
gameOverScreen.addEventListener('click', (e) => {
    if (e.target === gameOverScreen) startGame();
});

function resizeCanvas() {
    const container = document.getElementById('game-container');
    const aspectRatio = canvas.width / canvas.height;
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    if (containerWidth / containerHeight > aspectRatio) {
        canvas.style.height = '100%';
        canvas.style.width = 'auto';
    } else {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

draw();
