/*
document.addEventListener("keydown", e => {
    player.classList.add("playerMove");
    setTimeout(function() {player.classList.remove("playerMove")},100);
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
*/