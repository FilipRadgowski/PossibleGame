const startButton = document.querySelector('#startGame');
const actors = document.querySelectorAll('.actors:not(#player)');
const player = document.querySelector('#player');
const enemies = document.querySelectorAll('.enemy');

const main = document.querySelector('#main');

const statsDiv = document.querySelector('#statsDiv');
const scoreDisplay = document.querySelector('#scoreDisplay');
const goals = document.querySelectorAll('.goal');
const timeDisplay = document.querySelector('#timeDisplay');
const completionTime = document.querySelector('#completionTime');
const bestTime = document.querySelector('#bestTime');

let score = 0;
let timePassed;

let enemyMovementInterval;
let playerMovementInterval;
let timeInterval;

if(parseInt(document.cookie.replace('bestTime=', ''))){
    bestTime.innerHTML = `Your best time: ${formatTime(parseInt(document.cookie.replace('bestTime=', '')))}`;
}

updateScore();

startButton.addEventListener('click', e => {
    startButton.classList.add('pulsingClick');
    setTimeout(() => {startButton.classList.remove('pulsingClick')},2000);
    enemyMovementInterval = setInterval(moveEnemy, 10);
    playerMovementInterval = setInterval(playerMovement, 1);

    //Fade in animation for game start
    for (const actor of actors) {
        actor.style.animation = 'lowTaperFade 2s';
    }
    player.style.animation = 'lowTaperFade 2s';
    statsDiv.style.animation = 'lowTaperFade 2s';
    setTimeout(() => {
        for (const actor of actors) {
            actor.style.animation = '';
            actor.style.setProperty('opacity','100%');
        }
        player.style.animation = '';
        statsDiv.style.animation = '';
        player.style.setProperty('opacity','100%');
        statsDiv.style.setProperty('opacity','100%');
    }, 2000);
    
    main.style.setProperty('opacity','0%');
    startButton.classList.add('hidden');
    //End game start animation

    //Timer
    let timeStart = Date.now();
    timeInterval = setInterval(() => {
        timePassed = Math.floor((Date.now() - timeStart)/10);
        timeDisplay.innerHTML = formatTime(timePassed);

        if(Math.floor(timePassed/6000) >= 60){
            timeDisplay.innerHTML = "skill issue";
        }
    }, 10);
});

player.movementBrakes = {resetBrakes: function(){
    player.movementBrakes.right = false;
    player.movementBrakes.left = false;
    player.movementBrakes.up = false;
    player.movementBrakes.down = false;
}};

//Player movement keyboard trigger//
//(what rhymes with trigger? (those who know 💀))

let keys = {};
document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
});
document.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
});

function playerMovement(){
    checkCollision();

    if(keys.w && !player.movementBrakes.up){
        player.style.setProperty('top', `${player.offsetTop - 1}px`);
    }
    if(keys.s && !player.movementBrakes.down){
        player.style.setProperty('top', `${player.offsetTop + 1}px`);
    }
    if(keys.d && !player.movementBrakes.right){
        player.style.setProperty('left', `${player.offsetLeft + 1}px`);
    }
    if(keys.a && !player.movementBrakes.left){
        player.style.setProperty('left', `${player.offsetLeft - 1}px`);
    }

    player.movementBrakes.resetBrakes();
}

for (const enemy of enemies){
    //-1 - up
    //1 - down
    enemy.movement = -1;
    enemy.speed = 1;
}

enemies[1].speed = 2;
enemies[2].speed = 3;
enemies[3].speed = 5;
enemies[4].speed = 4;
enemies[5].speed = 7;
enemies[6].speed = 5;
enemies[6].movement = 1;

function moveEnemy(){
    for (const enemy of enemies){
        if(enemy.classList.contains('horizontalMovement')){
            if(enemy.offsetLeft <= 0){
                enemy.movement = 1;
            }
            if(enemy.offsetLeft >= window.innerWidth - 50){
                enemy.movement = -1;
            }
            enemy.style.setProperty('left', `${enemy.offsetLeft + enemy.movement*enemy.speed}px`);
            continue;
        }
        if(enemy.offsetTop <= 0){
            enemy.movement = 1;
        }
        if(enemy.offsetTop >= window.innerHeight - 50){
            enemy.movement = -1;
        }
        enemy.style.setProperty('top', `${enemy.offsetTop + enemy.movement*enemy.speed}px`);
    }
}

function checkCollision(){
    playerRect = player.getBoundingClientRect();

    for(const actor of actors){
        actorRect = actor.getBoundingClientRect();
        if(!simpleCollision(playerRect, actorRect))continue;
        if(actor.classList.contains('wall')){
            directionalCollision(playerRect, actorRect);
            continue;
        }
        if(actor.classList.contains('goal')){
            if(!actor.classList.contains('win')){
                score++;
                updateScore();
                endGame();
                actor.classList.add('win');
                setTimeout(() => {
                    actor.style.setProperty('visibility','hidden');
                }, 1000);
            }
            continue;
        }
        resetPlayerPosition();
    }
}

function simpleCollision(playerRect, actorRect){
    return !(actorRect.right < playerRect.left || actorRect.left > playerRect.right || actorRect.bottom < playerRect.top || actorRect.top > playerRect.bottom);
}

function directionalCollision(playerRect, actorRect){
    player.movementBrakes.right += (playerRect.right > actorRect.left && playerRect.left < actorRect.left);
    player.movementBrakes.left += (playerRect.left < actorRect.right && playerRect.right > actorRect.right);
    player.movementBrakes.up += (playerRect.top < actorRect.bottom && playerRect.bottom > actorRect.bottom);
    player.movementBrakes.down += (playerRect.bottom > actorRect.top && playerRect.top < actorRect.top);
}

function resetPlayerPosition(){
    player.style.setProperty('top', `${window.innerHeight/2}px`);
    player.style.setProperty('left', '10px');
}

function updateScore(){
    scoreDisplay.innerHTML = `${score}/${goals.length}`;
}

function formatTime(rawTime){
    if(Math.floor(rawTime/6000)%60 < 1){
        return `${Math.floor(rawTime/100)%60}.${Math.floor(rawTime%100)}`;
    }else{
        if(Math.floor(rawTime/100)%60 < 10){
            return `${Math.floor(rawTime/6000)%60}:0${Math.floor(rawTime/100)%60}.${Math.floor(rawTime%100)}`;
        }else{
            return `${Math.floor(rawTime/6000)%60}:${Math.floor(rawTime/100)%60}.${Math.floor(rawTime%100)}`;
        }
    }
}

function endGame(){
    if(score == goals.length){
        //stop the game
        clearInterval(playerMovementInterval);
        clearInterval(enemyMovementInterval);
        clearInterval(timeInterval);

        //check score
        completionTime.innerHTML = `Your time: ${timeDisplay.innerHTML}`;

        let cookieBestTime = parseInt(document.cookie.replace('bestTime=', ''));

        if(!cookieBestTime || cookieBestTime > timePassed){
            document.cookie = `bestTime=${timePassed}`;
            bestTime.innerHTML = `Your best time: ${formatTime(timePassed)}`;
        }

        //fadeout animation
        for (const actor of actors) {
            if(actor.classList.contains('goal')) continue;
            actor.style.animation = 'lowTaperFade 2s reverse';
        }
        player.style.animation = 'lowTaperFade 2s reverse';
        statsDiv.style.animation = 'lowTaperFade 2s reverse';
        completionTime.style.animation = 'lowTaperFade 2s';
        setTimeout(() => {
            for (const actor of actors) {
                actor.style.setProperty('opacity','0%');
            } 
            player.style.setProperty('opacity','0%');
            statsDiv.style.setProperty('opacity','0%');
            main.style.setProperty('opacity', '100%');
            completionTime.style.setProperty('opacity','100%');
        },2000);

        //show end screen
        main.style.animation = 'lowTaperFade 2s';
        completionTime.style.animation = 'lowTaperFade 2s';
    }
}

/*
function clearCookies(){
    // Reset cookies; For development use only! Uncomment and call in console to use.
    document.cookie = 'bestTime=;expires=Thu, 01 Jan 1970 00:00:00 UTC'; 
}
*/