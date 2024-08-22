const rows = 10;
const cols = 10;
const minesCount = 15;
let gameBoard = [];
let gameElement = document.getElementById('game');
let minesCounterElement = document.getElementById('mines-counter');
let timerElement = document.getElementById('timer');
let resetButton = document.getElementById('reset-button');
let seedInput = document.getElementById('seed-input');
let timer;
let startTime;
let minesRemaining = minesCount;
let seed = '12345'; // Semilla por defecto
var isPlaying = false;
var isTime = true;
// Función para inicializar el juego
function initializeGame() {

    seed = seedInput.value;

    resetButton.addEventListener('click', resetGame);
    seedInput.addEventListener('input', resetGame);
    resetGame();
}

function setSeed() {

    if (seedInput.value == seed) {
        seed = Math.floor(Math.random() * (99999 - 0) + 0);
        seedInput.value = seed;
    }

}

// Función para reiniciar el juego
function resetGame() {
    setSeed();
    isTime = true;
    isPlaying = false;
    seed = parseInt(seedInput.value) || 12345; // Obtener semilla del input o usar la por defecto
    gameBoard = [];
    gameElement.innerHTML = '';
    minesRemaining = minesCount;
    minesCounterElement.textContent = formatNumber(minesRemaining);
    clearInterval(timer);
    timerElement.textContent = '000';
    createBoard();

}


// Función para crear el tablero de juego
function createBoard() {
    gameElement.style.gridTemplateRows = `repeat(${rows}, 40px)`;
    gameElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', flagCell);
            gameElement.appendChild(cell);
            gameBoard[i][j] = {
                element: cell,
                mine: false,
                revealed: false,
                flagged: false,
                adjacentMines: 0
            };
        }
    }

    plantMines();
    calculateAdjacentMines();
}

// Función para plantar minas usando la semilla
function plantMines() {
    let minesPlanted = 0;
    let rng = mulberry32(seed); // Generador de números aleatorios con semilla

    while (minesPlanted < minesCount) {
        let row = Math.floor(rng() * rows);
        let col = Math.floor(rng() * cols);
        if (!gameBoard[row][col].mine) {
            gameBoard[row][col].mine = true;
            minesPlanted++;
        }
    }
}

// Generador de números aleatorios con semilla
function mulberry32(a) {
    return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Función para calcular el número de minas adyacentes para cada celda
function calculateAdjacentMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!gameBoard[i][j].mine) {
                let adjacentMines = countAdjacentMines(i, j);
                gameBoard[i][j].adjacentMines = adjacentMines;
            }
        }
    }
}

function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (gameBoard[newRow][newCol].mine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function revealCell(event) {
    if (isPlaying)
        return;
    if (isTime) {
        isTime = false;
        startTime = new Date();
        timer = setInterval(updateTimer, 1000);
    }
    let row = event.target.getAttribute('data-row');
    let col = event.target.getAttribute('data-col');
    let cell = gameBoard[row][col];
    if (!cell.revealed && !cell.flagged) {
        cell.revealed = true;
        cell.element.classList.add('revealed');
        if (cell.mine) {
            cell.element.classList.add('mine');
            // alert('¡Has perdido! El juego se reiniciará.');
            revealAllMines();
            isPlaying = true;
            // setTimeout(resetGame, 2000);
        } else {
            cell.element.textContent = cell.adjacentMines > 0 ? cell.adjacentMines : '';
            if (cell.adjacentMines === 0) {
                revealAdjacentCells(row, col);
            }
        }
    }
}

function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = parseInt(row) + i;
            let newCol = parseInt(col) + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                let adjacentCell = gameBoard[newRow][newCol];
                if (!adjacentCell.revealed && !adjacentCell.mine) {
                    revealCell({ target: adjacentCell.element });
                }
            }
        }
    }
}

function flagCell(event) {
    if (isPlaying)
        return;
    event.preventDefault();
    let row = event.target.getAttribute('data-row');
    let col = event.target.getAttribute('data-col');
    let cell = gameBoard[row][col];
    if (!cell.revealed) {
        cell.flagged = !cell.flagged;
        cell.element.classList.toggle('flagged');
        if (cell.flagged) {
            minesRemaining--;
        } else {
            minesRemaining++;
        }
        minesCounterElement.textContent = formatNumber(minesRemaining);
    }
}

function revealAllMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameBoard[i][j].mine) {
                if (gameBoard[i][j].flagged) {
                    gameBoard[i][j].flagged = !gameBoard[i][j].flagged;
                    gameBoard[i][j].element.classList.toggle('flagged');
                }
                gameBoard[i][j].element.classList.add('revealed');
                gameBoard[i][j].element.classList.add('mine');
            }
        }
    }
}

// Función para actualizar el temporizador
function updateTimer() {
    if (isPlaying)
        return;
    let currentTime = Math.floor((new Date() - startTime) / 1000);
    if (currentTime < 1000)
        timerElement.textContent = formatNumber(currentTime);
}

// Función para formatear números a 3 dígitos
function formatNumber(number) {
    return number.toString().padStart(3, '0');
}

// Iniciar el juego
initializeGame();
