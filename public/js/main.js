 /*************************
 *                        *
 * @author Sander Hellesø *
 *                        *    
 *************************/

// GLOBALS
let gameWindow;             // main game window
let gameMenu;               // main game menu
let gameHighscores;         // main game highscores
let gameOverScreen;         // main game game over screen
let enemyCont;              // enemy container
let enemyPosY = 12;         // enemies position y
let enemyPosX = 50          // enemies position X
let moving = false;         // check if enemies are moving
let moveVal;                // enemy movement interval
let enemies = 0;            // enemies current level
let enemiesKilled;          // enemies killed current level
let player;                 // player sprite
let score = 0;              // total accumulated score
let bgPosY = 0;             // background Y position
let posX = 50;              // player x position
let level = 0               // current game level
let dead = false;           // player lost round
let lifes = 3;              // users total lifes
let megaAvailable = false;  // mega combo
let loop;                   // game loop
let totalEnemiesKilled = 0; // total enemies killed
let saveGame;               // save game button
let highscore;              // highscore data
let movements;              // player movement events


// initialize game
window.onload = initMenu;

// initiate game menu, prepearing highcores and game
function initMenu() {
    checkBrowser();
    checkWindow();
    
    document.querySelector('#see-highscores').addEventListener('click', seeHighscores);
    document.querySelector('#back-to-menu').addEventListener('click', backToMenu);
    document.querySelector('#start-game').addEventListener('click', startGame);
    document.querySelector('input').addEventListener('keyup', (e) => validateName(e));
    gameWindow = document.querySelector('#game-window');
    gameMenu = document.querySelector('#menu');
    gameHighscores = document.querySelector('#highscores');
    gameOverScreen = document.querySelector('#game-over');
    saveGame = document.querySelector('#back-to-menu-game-over');
    saveGame.addEventListener('click', writeHighScore);
    window.addEventListener('resize', checkWindow);
}

// check window size
function checkWindow() {
    const height = $(window).height();
    const width = $(window).width();
    const gameCont = document.querySelector('#game-cont');
    const unavailable = document.querySelector('#unavailable');
    
    if (height < 700 || width < 700) {
        gameCont.style.display = 'none';
        unavailable.innerHTML = 'You need to be on a device with screen size of atleast 700x700 to play this game';
        unavailable.style.display = 'block';
        return;
    }
    
    if (height <= 800) {
        gameCont.style.margin = '7.5vh auto';
    }
    
    unavailable.style.display = 'none';
    gameCont.style.display = 'block';
}

// check for non-supported browsers
function checkBrowser() {
    
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    
    if (isOpera || isIE || isEdge) {
        var gameCont = document.querySelector('#game-cont');
        var unavailable = document.querySelector('#unavailable');
        unavailable.innerHTML = 'This game is only avaiable on Chrome, Firefox and Safari';
        unavailable.style.display = 'block';
        gameCont.style.display = 'none';
    }
}

// spawn lifes on game start
function spawnLife() {
    for (let i = 0; i < 3; i++) {
        const life = document.createElement('img');
        life.className = 'life';
        life.src = 'public/assets/ui/life.png';
        life.alt = 'life';
        document.querySelector('#life').appendChild(life);
    }
}

// validate users name on game over
function validateName(e) {
    if (e.target.value.length >= 2) {
        saveGame.disabled = false;
        saveGame.className = 'enabled-btn';
    }

    else {
        saveGame.disabled = true;
        saveGame.className = 'disabled-btn';
    }
}

// display game over menu
function gameOverMenu() {
    document.title = 'Game over! | Space Invaders';
    $('body').unbind('keypress');
    gameMenu.style.display = 'none';
    gameWindow.style.display = 'none';
    gameOverScreen.style.display = 'block';
}

// navigate back to menu 
function backToMenu() {
    document.title = 'Space Invaders | A journey through space';
    gameHighscores.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameMenu.style.display = 'block';
}


// see all highscores menu
function seeHighscores() {
    document.title = 'Highscores | Space Invaders';
    Array.from(document.querySelectorAll('.highscore-list')).forEach(list => {
        gameHighscores.removeChild(list);
    });

    readHighscores();

    gameMenu.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameHighscores.style.display = 'block';
}

// start main game
function startGame() {
    gameMenu.style.display = 'none';
    gameWindow.style.display = 'block';
    
    spawnLife();
    initPlayer();
    showLevelAnnouncement();
    startLevel();
    gameLoop();
}


// initalize game loop
function gameLoop() {
    loop = setInterval(() => {
        updateScore();
        moveBg();
        updateTitle();
    }, 100);
}

// update browser title
function updateTitle() {
    document.title = `Level: ${level} | Score: ${score} | Space Invaders`;
}

// update score
function updateScore() {
    score += 5;
    document.querySelector('#score').innerHTML = `Score: ${score}`;
    if (score >= 3000 && score % 1000 === 0) {
        showMegaCombo();
        megaAvailable = true;
    }
}


// animate game background
function moveBg() {
    gameWindow.style.backgroundPosition = `100% ${bgPosY}%`;

    if (bgPosY >= 100) {
        bgPosY = 0;
    }

    bgPosY += 10;
}

// initialize player and movements
function initPlayer() {
    player = document.querySelector('#player-cont');
    player.style.left = `${posX}%`;

    $('body').bind('keypress', (e) => {
        if (e.keyCode === 13 || e.keyCode === 32) {
            shoot();
        }
    
        // left
        else if (e.key === 'a') {
            if (posX >= 2) {
                moveLeft();
            }
        }
    
        // right
        else if (e.key === 'd') {
            if (posX <= 86) {
                moveRight();
            }
        }
    
        // mega shoot (combo)
        else if (e.key === 'c' && megaAvailable) {
            mega();
            megaAvailable = false;
        }
    });
    
    //document.body.addEventListener('keydown', e => movePlayer(e));
    document.body.addEventListener('keyup', () => {
        player.style.transform = 'rotate(0deg)';
    });
}

// fire off mega combo
function mega() {
    for (let i = 0; i < 20; i++) {
        shoot(i);
    }
}

// shoot bullet from players position
function shoot(megaPos) {
    let bulletPosY = 5;
    const bullet = document.createElement('div');
    if (megaPos) {
        bullet.className = `bullet animated pulse mega bullet${Math.floor(Math.random() * 5) + 1}`;
        bullet.style.left = `${megaPos * 5}%`;
    }

    else {
        bullet.className = `bullet animated pulse bullet${Math.floor(Math.random() * 5) + 1}`;
        bullet.style.left = `${(posX + 5)}%`;
    }

    playSound('shoot');
    gameWindow.appendChild(bullet);

    const moveBullet = setInterval(() => {
        if (bulletPosY <= 94) {
            bulletPosY += 5;

            bullet.style.bottom = `${bulletPosY}%`;
            hitEnemy(bullet);
        }

        else {
            gameWindow.removeChild(bullet);
            clearInterval(moveBullet);
        }
    }, 75);
}

// move player to the left
function moveLeft() {
    posX -= 4;
    
    if (posX <= 0) {
        posX = 86;
    }
    
    player.style.transform = 'rotate(-10deg)';
    player.style.left = `${posX}%`;
}


// move player to the right
function moveRight() {
    posX += 4;
    
    if (posX >= 90) {
        posX = 2;
    }
    
    player.style.transform = 'rotate(10deg)';
    player.style.left = `${posX}%`;
}

// start new level 
function startLevel() {
    enemiesKilled = 0;
    
    if (enemies < 18) {
        enemies++;
    }
    
    level++;
    updateStats();
    document.querySelector('#level').innerHTML = `Level: ${level}`;
    enemyCont = document.querySelector('#enemy-cont');
    
    // render enemies
    enemies = enemies > 18 ? 18 : enemies;
    for (let i = 0; i < enemies; i++) {
        setTimeout(() => {
            createEnemy(i);
        }, i * 100);
    } 

    moveEnemies();
}

// move enemies in pattern depending on level
function moveEnemies() {
    moveVal = setInterval(() => {
        enemyPosY += getMovement();
        if (moving) {
            enemyPosX += getMovement();
            moving = false;
        }

        else {
            enemyPosX -= getMovement();
            moving = true;
        }
        
        enemyCont.style.top = `${enemyPosY}%`;
        enemyCont.style.left = `${enemyPosX}%`;
        hitPlayer();
    }, levelSpeed());
}

// set enemy movement speed depening on current level
function levelSpeed() {
    const value = (2000 - (level * 35));
    if (value <= 500) {
        return 500 - (level * 2);
    }
    
    return value;
}

// return a movement strength of 1 - 4
function getMovement() {
    return Math.floor(Math.random() * 4) + 1;
}

// create a new enemy and position on screen
function createEnemy(enemyIndex) {
    const enemy = document.createElement('img');
    enemy.src = 'public/assets/sprites/invader.png';    
    enemy.className = 'enemy animated zoomInUp';
    setTimeout(() => {
        enemy.className = 'enemy spawned-enemy';
    }, 1000);
    setTimeout(() => {
        playSound('enemy');
    }, 500);
    
    enemyCont.appendChild(enemy);
}

// attempt to detect if enemy is hit by bullet
function hitEnemy(bullet) {
    const bulletPos = bullet.getBoundingClientRect()
    Array.from(document.querySelectorAll('.enemy')).forEach((enemy) => {
        const enemyPos = enemy.getBoundingClientRect();
        if (bulletPos.x >= enemyPos.left &&
        bulletPos.x <= enemyPos.right &&
        bulletPos.y >= enemyPos.top &&
        bulletPos.y <= enemyPos.bottom && bullet.style.opacity !== '0') {
            if (enemy.style.opacity !== '0') {
                bullet.style.opacity = '0';
                removeEnemy(enemy);
            }
        }
    });
}

// attempt to detect if player is hit by enemy
function hitPlayer() {
    const playerPos = player.getBoundingClientRect();
    Array.from(document.querySelectorAll('.enemy')).forEach((enemy) => {
        const enemyPos = enemy.getBoundingClientRect();
        if (playerPos.x >= enemyPos.left &&
        playerPos.x <= enemyPos.right &&
        playerPos.y >= enemyPos.top &&
        playerPos.y <= enemyPos.bottom || 
        enemyPos.bottom + 20 >= gameWindow.getBoundingClientRect().bottom) {
            if (enemy.style.opacity !== '0') {
                dead = true;
                removeLife();
            }
        }
    });
}

// remove a life from player
function removeLife() {
    lifes--;
    score -= 1000;
    playSound('explosion');

    Array.from(document.querySelectorAll('.life'))
    .reverse()[0].className = 'life animated bounceOut';
    setTimeout(() => {
        document.querySelector('#life')
        .removeChild(Array.from(document.querySelectorAll('.life'))
        .reverse()[0]);
    }, 1000);
    
    // if out of life, game is over
    if (lifes === 0) {
        gameOver();
        return;
    }
    
    // else we update stats and trigger next level
    updateStats();
}

// game over, clean up loops and enemies remaining on screen
function gameOver() {
    clearInterval(loop);
    clearEnemies();
    gameOverMenu();
}

// update game stats
function updateStats() {
    document.querySelector('#stats').innerHTML = `Enemies Killed: ${enemiesKilled}/${enemies}`;
    
    if (enemiesKilled === enemies || dead) {
        clearEnemies();
        
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


// clear all enemies from screen
function clearEnemies() {
    Array.from(document.querySelectorAll('.enemy')).forEach((enemy) => {
        enemyCont.removeChild(enemy);
    });
}

// display announcement of current level
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


// display announcement of mega combo avaiable
function showMegaCombo() {
    const announcement = document.querySelector('#mega-ready');
    announcement.className = 'animated fadeIn';
    announcement.style.display = 'block';
    setTimeout(() => {
        announcement.className = 'animated zoomOut';
        setTimeout(() => {
            announcement.style.display = 'none';
        }, 750);
    }, 750);
}

// remove enemy from game
function removeEnemy(enemy) {
    playSound('invaderkilled');
    enemy.style.opacity = '0';
    enemiesKilled++;
    totalEnemiesKilled++;
    score += 100;
    updateStats();
}

// play sound depending on parameter
function playSound(sound) {
    const audio = document.createElement('audio');
    audio.src = `public/assets/sounds/${sound}.wav`;
    audio.style.display = 'none';
    document.body.appendChild(audio);

    audio.volume = '0.3';
    audio.play();
    setTimeout(() => {
        document.body.removeChild(audio);
    }, 1000);
}


// write score to highscore list
async function writeHighScore() {
    const scores = await getHighscores();
    const playerScore = {
        [Object.keys(scores).length]: {
            "name": document.querySelector('input').value,
            "score": score,
            "level": level,
            "date": new Date().toJSON().slice(0,10).replace(/-/g,'/')
        }
    };
    
    // merge old and new score together
    const mergedScores = {
        ...scores,
        ...playerScore
    }
    
    // strinify JSON and send to PHP script to save score
    const stringifyData = JSON.stringify(mergedScores);
    $.ajax({
        type: 'POST',
        dataType : 'json',
        async: true,
        url: 'server/saveHighScore.php',
        data: { data: stringifyData }
    })
    .always(() => {
        seeHighscores();
        reset();
    });
}

// read from JSON file and create list containig scores
async function readHighscores() {
    
    const scores = [];
    const scoresData = await getHighscores();
    
    $.each(scoresData, (key, val) => {
        scores.push
        (
            `<li id=${key}
                value=${val.score}
            >
            <span>${val.name}</span> 
            <span>${val.score}</span> 
            <span>${val.level}</span> 
            <span>${val.date}</span>
            </li>`
        );
    });
    
    // sort by score descending
    scores.sort((a, b) => { 
        return b.split('value=')[1].split('>')[0] - a.split('value=')[1].split('>')[0]
    });

    $('<ul/>', {
        'class': 'highscore-list animated fadeIn',
        html: scores.join("") 
    }).appendTo('#highscores');
}

// fetch highscore data
async function getHighscores() {
    
    try {
        
        // no cache added so we can get fresh updates incase other players have added scores
        const response = await $.getJSON(`public/highscores/highscores.json?nocache=${(new Date()).getTime()}`);
        return response;
    } 
    
    catch(error) {
        console.log(error);
    }
}

// reset game, clear and reset dependency variables
function reset() {
    score = 0;
    level = 0;
    dead = false;
    lifes = 3;
    enemyPosY = 12;
    enemyPosX = 50;
    moving = false;
    enemies = 0;
    enemiesKilled = 0;
    megaAvailable = false;
    totalEnemiesKilled = 0;
    loop = null;
    enemyCont.style.top = '12%';
    clearInterval(moveVal);
    clearEnemies();
}