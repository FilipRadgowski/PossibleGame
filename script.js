const startButton = document.querySelector("#startGame");
startButton.addEventListener("click",function(e){
    startButton.classList.add("pulsingClick");
    setTimeout(function() {startButton.classList.remove("pulsingClick")},2000);
    setInterval(moveEnemy, 10);
    setInterval(checkCollision, 10);
    setInterval(checkWin, 10);
    setInterval(playerMovement, 1);

    startButton.classList.add("hidden");
});

const enemiesObj = {

}

const player = document.querySelector("#player");
const enemies = document.querySelectorAll(".enemy");
console.log(enemies);
const goal = document.querySelector("#goal1");

//-1 - up
//1 - down

for (const enemy of enemies) {
    enemy.movementFlag = -1;
    enemy.speedFlag = 1;
    if (enemy.getAttribute("id") == "enemy1") enemy.speedFlag = 2;
    if (enemy.getAttribute("id") == "enemy2") enemy.speedFlag = 3;
}

function moveEnemy () {
    for (const enemy of enemies) {
        if(enemy.offsetTop <= 0) {
            enemy.movementFlag = 1;
        }
        if (enemy.offsetTop >= window.innerHeight - 50) {
            enemy.movementFlag = -1;
        }
        enemy.style.setProperty('top', `${enemy.offsetTop + enemy.movementFlag*enemy.speedFlag}px`);
    }
}

// the blocks getting freaky and smashing (into) eachother (consentually) 

function checkCollision() {
    for (const enemy of enemies) {
        encord = enemy.getBoundingClientRect();
        plcord = player.getBoundingClientRect();
        let overlap = !(encord.right < plcord.left || encord.left > plcord.right || encord.bottom < plcord.top || encord.top > plcord.bottom);
        if (overlap){
            player.style.setProperty("top", window.innerHeight/2 + "px");
            player.style.setProperty("left", 10 +"px");
        }
    }   
}

function checkWin() {
    glcord = goal.getBoundingClientRect();
    plcord = player.getBoundingClientRect();
    let overlap = !(glcord.right < plcord.left || glcord.left > plcord.right || glcord.bottom < plcord.top || glcord.top > plcord.bottom);
    if (overlap){
        player.style.setProperty("top", window.innerHeight/2 + "px");
        player.style.setProperty("left", 10 +"px");
    }
}
//Player movement keyboard trigger//
// (what rhymes with trigger? (those who know 💀))

let keys = {};
document.addEventListener('keydown', e => {
    keys[e.keyCode || e.which] = true;
});
document.addEventListener("keyup", e => {
    keys[e.keyCode || e.which] = false;
});

//key w - 87
//key s - 83
//key a - 65
//key d - 68

function playerMovement() {
    if (keys[87] && !keys[83]) {
        player.style.setProperty("top",player.offsetTop - 1 +"px");
    }
    if (keys[83] && !keys[87]) {
        player.style.setProperty("top",player.offsetTop + 1 +"px");
    }
    if (keys[68] && !keys[65]) {
        player.style.setProperty("left",player.offsetLeft + 1 +"px");
    }
    if (keys[65] && !keys[68]) {
        player.style.setProperty("left",player.offsetLeft - 1 +"px");
    }
}