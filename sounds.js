// ---sonidos ----------
let soundExplosion = new Audio('sounds/explosion.mp3');
let soundFlag = new Audio('sounds/flag.mp3');
let soundWin = new Audio('sounds/win.mp3');
let soundReset = new Audio('sounds/reset.mp3');
let soundCell = new Audio('sounds/cell.mp3');
let soundWaa = new Audio('sounds/Waa.mp3');
// // -------------

// Precargar los sonidos 
soundExplosion.load();
soundWin.load();
soundFlag.load();
soundCell.load();
soundReset.load();
soundWaa.load();

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function winPlay() {
    soundFlag.currentTime = 1;
    soundCell.currentTime = 1;
    playSound(soundWin);
}

function flagPlay() {
    playSound(soundFlag);
}

function cellPlay() {
    playSound(soundCell);
}

function resetPlay() {
    playSound(soundReset);
}

function explosionPlay() {
    soundExplosion.volume = 0.3;
    playSound(soundExplosion);
}

function gameOverPlay() {
    soundWaa.volume = 0.3;
    playSound(soundWaa);
}