window.onload = startApp;


function startApp() {
    initPlayer();
    gameLoop();
}

function gameLoop() {
    setInterval(() => {
        moveBg();
    }, 100);
}


// animate game background
let bgPosY = 0;
function moveBg() {
    const bg = document.querySelector('#game-window');
    bg.style.backgroundPosition = `100% ${bgPosY}%`;

    if (bgPosY >= 100) {
        bgPosY = 0;
    }

    bgPosY += 10;
}

let player;
let posX = 50;
function initPlayer() {
    player = document.querySelector('#player-cont');
    player.style.left = `${posX}%`;
    player.style.transform = `translate(${-posX}%)`;

    document.body.addEventListener('keydown', (e) => {

        // left
        if (e.keyCode === 65 || e.keyCode === 37) {
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