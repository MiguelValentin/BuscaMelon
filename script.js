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
    resetButton.textContent = '😊';

}


// Función para crear el tablero de juego
function createBoard() {
    // gameElement.style.gridTemplateRows = `repeat(${rows}, 40px)`;
    // gameElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;


    // Limpiar cualquier contenido existente
    gameElement.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('mousedown', changeEmoji);
            cell.addEventListener('pointerdown', changeEmoji);
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
    const firstCell = document.querySelector('.cell');
    const cellWidth = firstCell.offsetWidth; // Obtiene el ancho de la celda en píxeles
    const cellHeight = firstCell.offsetHeight; // Obtiene la altura de la celda en píxeles
    // const cellSize = Math.min(containerWidth / cols, containerHeight / rows);

    // console.log(`El tamaño de la celda es: ${cellWidth}px x ${cellHeight}px`);

    // Ajustar las filas y columnas del grid con el tamaño calculado
    gameElement.style.gridTemplateRows = `repeat(${rows}, ${cellWidth}px)`;
    gameElement.style.gridTemplateColumns = `repeat(${cols}, ${cellHeight}px)`;
    plantMines();
    calculateAdjacentMines();
}

function changeEmoji(event) {
    if (isPlaying)
        return;
    let row = event.target.getAttribute('data-row');
    let col = event.target.getAttribute('data-col');
    let cell = gameBoard[row][col];
    if (!cell.revealed && !cell.flagged) {
        resetButton.textContent = '😬';
    }
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
            resetButton.textContent = '😊';
            cell.element.textContent = cell.adjacentMines > 0 ? cell.adjacentMines : '';
            if (cell.adjacentMines === 0) {
                revealAdjacentCells(row, col);
            }
        }
    }
    checkingMines();
}

function checkingMines() {
    if (minesRemaining != 0)
        return;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameBoard[i][j].mine && !gameBoard[i][j].flagged) {
                return;
            } else if (!gameBoard[i][j].mine && !gameBoard[i][j].revealed) {
                return;
            }
        }
    }
    isPlaying = true;
    showWinPopup();
}

function showWinPopup() {
    const winPopup = document.getElementById('win-popup');
    winPopup.style.display = 'flex'; // Mostrar el popup

    // Añadir evento para cerrar el popup
    const closeBtn = document.getElementById('close-popup');
    closeBtn.addEventListener('click', () => {
        winPopup.style.display = 'none';
    });
    // Lanzar confeti
    confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.7 },
        ticks: 70,
    }); 
    // Configuración adicional para hacer que el confeti sea más continuo
    var duration = 5 * 50; // Duración del confeti en milisegundos
    var end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            ticks: 70,
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            ticks: 70,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
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


    event.preventDefault();
    if (isPlaying)
        return;
    let row = event.target.getAttribute('data-row');
    let col = event.target.getAttribute('data-col');

    let cell = gameBoard[row][col];
    if (minesRemaining == 0 && !cell.flagged)
        return;
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
    resetButton.textContent = '🫣';
    checkingMines();
}

function revealAllMines() {

    showSadFace(); // Cambia el emoji cuando todas las minas estén reveladas
    let minesToReveal = [];

    // Recolecta todas las minas en una lista
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (gameBoard[i][j].mine) {
                minesToReveal.push(gameBoard[i][j]);
            }
        }
    }

    function revealNextMine(index) {
        if (index >= minesToReveal.length) {
            return;
        }
        let cell = minesToReveal[index];
        if (cell.flagged) {
            cell.flagged = !cell.flagged;
            cell.element.classList.toggle('flagged');
        }

        if (!cell.revealed) {
            cell.element.classList.add('mine', 'exploding'); // Añadir la clase 'exploding'
        }
        setTimeout(() => {
            cell.element.classList.remove('exploding'); // Remover la clase después de la animación
            revealNextMine(index + 1);
        }, 50); // Duración de la animación, ajustable

    }
    // Inicia la revelación secuencial
    revealNextMine(0);

}

// Función para cambiar el emoji cuando el jugador pierde
function showSadFace() {
    resetButton.textContent = '😭'; // Cambiar el emoji a una carita triste
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
