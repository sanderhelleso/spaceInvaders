window.onload = startApp;


function startApp() {
    gameLoop();
}

function gameLoop() {
    setInterval(() => {
        moveBg();
    }, 100);
}

let bgPosY = 0;
function moveBg() {
    const bg = document.querySelector('#game-window');
    bg.style.backgroundPosition = `100% ${bgPosY}%`;

    if (bgPosY >= 100) {
        bgPosY = 0;
    }

    bgPosY += 5;
}