const startButton = document.querySelector("#startGame");
startButton.addEventListener("click",function(e){
    startButton.classList.add("pulsingClick");
    setTimeout(function() {startButton.classList.remove("pulsingClick")},2000);
    setInterval(moveEnemy, 10);
    setInterval(checkCollision,10);
});

const player = document.querySelector("#player");
const enemy = document.querySelector("#enemy1");

let acceleration = 1.2;
let speed = 1;

let flag = false; //false - up true - down
function moveEnemy () {
    if(enemy.offsetTop <= 0)
        {
            flag = true;
        }
    if (enemy.offsetTop >= window.innerHeight - 50)
        {
            flag = false;
        }
    if (flag == false)
    {
        enemy.style.setProperty("top",enemy.offsetTop - 1 + "px");
    }
    else {
        enemy.style.setProperty("top",enemy.offsetTop + 1 + "px");
    }

}

function checkCollision() {
    encord = enemy.getBoundingClientRect();
    plcord = player.getBoundingClientRect();
    let overlap = !(encord.right < plcord.left || encord.left > plcord.right || encord.bottom < plcord.top || encord.top > plcord.bottom);
    if (overlap){
    player.style.setProperty("top", 10 + "px");
    player.style.setProperty("left", 10 +"px");
    }
}

//Player movement keyboard trigger//
// (what rhymes with trigger? (those who know 💀))

document.addEventListener("keydown", e => {
    if (e.key === "s"){
        player.style.setProperty("top",player.offsetTop + speed +"px");
    }
    if (e.key === "d"){
        player.style.setProperty("left",player.offsetLeft + speed +"px");
    }
    if (e.key === "w"){
        player.style.setProperty("top",player.offsetTop - speed +"px");
    }
    if (e.key === "a"){
        player.style.setProperty("left",player.offsetLeft - speed +"px");
    }
    
    while(speed < 3.2){
        speed *= acceleration;
    }
});

document.addEventListener("keyup", e => {
    speed = 1;
})