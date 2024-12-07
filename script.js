const startButton = document.querySelector('#startGame');
startButton.addEventListener('click', e => {
    startButton.classList.add('pulsingClick');
    setTimeout(function(){startButton.classList.remove('pulsingClick')},2000);
    setInterval(moveEnemy, 10);
    //setInterval(checkCollision, 10);
    //setInterval(checkWin, 1);
    setInterval(playerMovement, 1);

    startButton.classList.add('hidden');
});

const player = document.querySelector('#player');
const enemies = document.querySelectorAll('.enemy');
const stuckText = document.querySelector('#stuckText');

const actors = document.querySelectorAll('.actors:not(#player)');

player.movementBrakes = {resetBrakes: function(){
    player.movementBrakes.right = false;
    player.movementBrakes.left = false;
    player.movementBrakes.up = false;
    player.movementBrakes.down = false;
}};

//Player movement keyboard trigger//
// (what rhymes with trigger? (those who know 💀))

let keys = {};
document.addEventListener('keydown', e => {
    keys[e.keyCode || e.which] = true;
});
document.addEventListener('keyup', e => {
    keys[e.keyCode || e.which] = false;
});

/*key w - 87//
//key s - 83//
//key a - 65//
//key d - 68*/
function playerMovement(){

    checkCollision();

    if(keys[87] && !player.movementBrakes.up){
        player.style.setProperty('top', `${player.offsetTop - 1}px`);
    }
    if(keys[83] && !player.movementBrakes.down){
        player.style.setProperty('top', `${player.offsetTop + 1}px`);
    }
    if(keys[68] && !player.movementBrakes.right){
        player.style.setProperty('left', `${player.offsetLeft + 1}px`);
    }
    if(keys[65] && !player.movementBrakes.left){
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

function moveEnemy(){
    for (const enemy of enemies){
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
        console.log();
        if(!(actorRect.right < playerRect.left || actorRect.left > playerRect.right || actorRect.bottom < playerRect.top || actorRect.top > playerRect.bottom)){
            if(actor.classList.contains('wall')){
                directionalCollision(playerRect, actorRect);
            }else{
                //resetPlayerPosition();
            }
        }
    }
}

function directionalCollision(playerRect, actorRect){
    player.movementBrakes.right = (playerRect.right > actorRect.left && playerRect.left < actorRect.left);
    player.movementBrakes.left = (playerRect.left < actorRect.right && playerRect.right > actorRect.right);
    player.movementBrakes.up = (playerRect.top < actorRect.bottom && playerRect.bottom > actorRect.bottom);
    player.movementBrakes.down = (playerRect.bottom > actorRect.top && playerRect.top < actorRect.top);
}

function resetPlayerPosition(){
    player.style.setProperty('top', `${window.innerHeight/2}px`);
    player.style.setProperty('left', '10px');
}