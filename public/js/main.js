window.onload = startGame;

// GLOBALS
let gameWindow;         // main game window
let enemyCont;          // enemy container
let enemyPosY = 12;     // enemies position y
let enemyPosX = 50      // enemies position X
let moving = false;     // check if enemies are moving
let moveVal;            // enemy movement interval
let enemies = 0;        // enemies current level
let enemiesKilled;      // enemies killed current level
let player;             // player sprite
let score = 0;          // total accumulated score
let bgPosY = 0;         // background Y position
let posX = 50;          // player x position
let level = 0           // current game level
let dead = false;       // player lost round
let lifes = 3;          // users total lifes

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
    for (let i = 0; i < enemies; i++) {
        setTimeout(() => {
            createEnemy(i);
        }, i * 100);
    } 

    moveEnemies();
}

function moveEnemies() {
    moveVal = setInterval(() => {
        enemyPosY += 4;
        if (moving) {
            enemyPosX += 4;
            moving = false;
        }

        else {
            enemyPosX -= 4;
            moving = true;
        }
        enemyCont.style.top = `${enemyPosY}%`;
        enemyCont.style.left = `${enemyPosX}%`;
        hitPlayer();
    }, 2000);
}

function createEnemy(enemyIndex) {
    const enemy = document.createElement('img');
    enemy.src = '../public/assets/sprites/invader.png';    
    enemy.className = 'enemy animated zoomInUp';
    setTimeout(() => {
        enemy.className = 'enemy spawned-enemy';
        //enemyFire(enemy);
    }, 1000);
    
    enemyCont.appendChild(enemy);
}

function enemyFire(enemy) {
    const moveBullet = setInterval(() => {

        const enemyPos = enemy.getBoundingClientRect();
        const bullet = document.createElement('div');
        bullet.className = 'bullet animated pulse';
        bullet.style.left = `${enemyPos.left}px`;
        bullet.style.bottom = `${enemyPos.bottom}px`;
        gameWindow.appendChild(bullet);

        setInterval(() => {
            bullet.style.bottom = `${enemyPos.bottom - 5}px`;
            bullet.style.top = `${enemyPos.top - 5}px`;
        }, 75);

        if (enemy.style.opacity === '0') {
            clearInterval(moveBullet);
        }
    }, 1000);
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

function hitPlayer() {
    const playerPos = player.getBoundingClientRect();
    Array.from(document.querySelectorAll('.enemy')).forEach((enemy) => {
        const enemyPos = enemy.getBoundingClientRect();
        if (playerPos.x >= enemyPos.left && playerPos.x <= enemyPos.right && playerPos.y >= enemyPos.top && playerPos.y <= enemyPos.bottom || enemyPos.bottom + 20 >= gameWindow.getBoundingClientRect().bottom) {
            if (enemy.style.opacity !== '0') {
                console.log('DEAD');
                dead = true;
                if (!removeLife()) {
                    updateStats();
                }
            }
        }
    });
}

function removeLife() {
    lifes--;
    score -= 500;

    Array.from(document.querySelectorAll('.life')).reverse()[0].className = 'life animated bounceOut';

    if (lifes === 0) {
        gameOver();
        return true;
    }

    setTimeout(() => {
        document.querySelector('#life').removeChild(Array.from(document.querySelectorAll('.life')).reverse()[0]);
    }, 1000);

    return false;
}

function gameOver() {
    console.log('GAME OVER');
}

function updateStats() {
    document.querySelector('#stats').innerHTML = `Enemies Killed: ${enemiesKilled}/${enemies}`;

    if (enemiesKilled === enemies || dead) {
        Array.from(document.querySelectorAll('.enemy')).forEach((enemy) => {
            enemyCont.removeChild(enemy);
        });
        
        dead = false;
        enemyPosY = 12;
        enemyPosX = 50;
        enemyCont.style.top = `${enemyPosY}%`;
        enemyCont.style.left = `${enemyPosX}%`;
        clearInterval(moveVal);
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
    updateStats();
}