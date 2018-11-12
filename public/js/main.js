window.onload = startGame;

// GLOBALS
let gameWindow;     // main game window
let enemyCont;      // enemy container
let enemies = 0;    // enemies current level
let enemiesKilled;  // enemies killed current level
let player;         // player sprite
let score = 0;      // total accumulated score
let bgPosY = 0;     // background Y position
let posX = 50;      // player x position
let level = 0       // current game level

function startGame() {
    initPlayer();
    showLevelAnnouncement();
    startLevel();
    gameLoop();
}

function gameLoop() {
    setInterval(() => {
        updateScore();
        moveBg();
    }, 100);
}

// update score
function updateScore() {
    score += 5;
    document.querySelector('#score').innerHTML = `Score: ${score}`;
}


// animate game background
function moveBg() {
    gameWindow = document.querySelector('#game-window');
    gameWindow.style.backgroundPosition = `100% ${bgPosY}%`;

    if (bgPosY >= 100) {
        bgPosY = 0;
    }

    bgPosY += 10;
}

function initPlayer() {
    player = document.querySelector('#player-cont');
    player.style.left = `${posX}%`;
    player.style.transform = `translate(${-posX}%)`;

    document.body.addEventListener('keydown', (e) => {

        if (e.keyCode === 13 || e.keyCode === 32) {
            shoot();
        }

        // left
        else if (e.keyCode === 65 || e.keyCode === 37) {
            if (posX >= 2) {
                moveLeft();
            }
        }

        // right
        else if (e.keyCode === 68 || e.keyCode === 39) {
            if (posX <= 86) {
                moveRight();
            }
        }
    });

    document.body.addEventListener('keyup', () => {
        player.style.transform = 'rotate(0deg)';
    });
}

function shoot() {
    let bulletPosY = 20;
    const bullet = document.createElement('div');
    bullet.className = 'bullet animated pulse';
    bullet.style.left = `${posX + 5}%`;
    gameWindow.appendChild(bullet);

    const moveBullet = setInterval(() => {
        if (bulletPosY <= 94) {
            bulletPosY += 5;

            bullet.style.bottom = `${bulletPosY}%`;
            hitEnemy(bullet.getBoundingClientRect());
        }

        else {
            gameWindow.removeChild(bullet);
            clearInterval(moveBullet);
        }
    }, 75);
}

function moveLeft() {
    posX -= 1.5;
    player.style.transform = 'rotate(-10deg)';
    player.style.left = `${posX}%`;
}

function moveRight() {
    posX += 1.5;
    player.style.transform = 'rotate(10deg)';
    player.style.left = `${posX}%`;
}

function startLevel() {
    enemiesKilled = 0;
    enemies++;
    level++;
    updateStats();
    document.querySelector('#level').innerHTML = `Level: ${level}`;
    enemyCont = document.querySelector('#enemy-cont');
    
    // render enemies
    for(let i = 0; i < enemies; i++) {
        setTimeout(() => {
            createEnemy(i);
        }, i * 100);
    } 
}

function createEnemy(enemyIndex) {
    const enemy = document.createElement('img');
    enemy.src = '../public/assets/sprites/invader.png';    
    enemy.className = 'enemy animated zoomInUp';
    
    enemyCont.appendChild(enemy);
}

function hitEnemy(bulletPos) {
    Array.from(document.querySelectorAll('.enemy')).forEach((enemy) => {
        const enemyPos = enemy.getBoundingClientRect();
        if (bulletPos.x >= enemyPos.left && bulletPos.x <= enemyPos.right && bulletPos.y >= enemyPos.top && bulletPos.y <= enemyPos.bottom) {
            if (enemy.style.opacity !== '0') {
                removeEnemy(enemy);
            }
        }
    });
}

function updateStats() {
    document.querySelector('#stats').innerHTML = `Enemies Killed: ${enemiesKilled}/${enemies}`;

    if (enemiesKilled === enemies) {
        Array.from(document.querySelectorAll('.enemy')).forEach((enemy) => {
            enemyCont.removeChild(enemy);
        });

        showLevelAnnouncement();
        setTimeout(() => {
            startLevel();
        }, 1000);
    }
}

function showLevelAnnouncement() {
    const announcement = document.querySelector('#announcement');
    announcement.innerHTML = `LEVEL ${level + 1}`;
    announcement.className = 'animated fadeInUp';
    announcement.style.display = 'block';
    setTimeout(() => {
        announcement.className = 'animated fadeOutUp';
        setTimeout(() => {
            announcement.style.display = 'none';
        }, 1000);
    }, 1000);
}

function removeEnemy(enemy) {
    enemy.style.opacity = '0';
    enemiesKilled++;
    score += 100;
    //explode(enemy);
    updateStats();
}

function explode(enemy) {
    const enemyPos = enemy.getBoundingClientRect();
    const explosion = document.createElement('img');
    explosion.src = '../public/assets/sprites/explosion.gif';    
    explosion.className = 'explosion';
    explosion.style.left = `${enemyPos.left}px`;
    explosion.style.right = `${enemyPos.right}px`;
    explosion.style.top = `${enemyPos.top}px`;
    explosion.style.bottom = `${enemyPos.bottom}px`;

    document.body.appendChild(explosion);
    setTimeout(() => {
        document.body.removeChild(explosion);
    }, 700);
}