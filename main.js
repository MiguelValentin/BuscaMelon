
const minesCount = 17;
const defaultTimer = '000';

let minesCounterElement = document.getElementById('mines-counter');

let timerElement = document.getElementById('timer');

let timer;
let startTime;
let minesRemaining = minesCount;
let seed;

var isGameOver = false;
var counterStarted = false;

// Función para inicializar el juego
function initializeGame() {
    setActionsUI();
    resetGame();
}

// Función para reiniciar el juego
function resetGame() {
    generateRandomSeed();
    clearSeedInputText();
    setGame();
}

function setGame() {
    initValues();
    clearInterval(timer);
    createBoard();
    idleAnim();
}

// Iniciar el juego
initializeGame();
