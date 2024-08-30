
let minesCount = 17;
let rows = 10;
let cols = 10;

let gameBoard = [];
let gameElement = document.getElementById('game');

const mineCell = "mine";

const numberCell = "number";
const voidCell = "void";

const babuLevel = {
    rows: 10,
    cols: 5,
    minesCount: 6,
}

const knightLevel = {
    rows: 10,
    cols: 10,
    minesCount: 17,
}

const kingLevel = {
    rows: 10,
    cols: 30,
    minesCount: 60,
}

const typeCell = {
    mine: 'mine',
    number: 'number',
    void: 'void',
    null: 'null'
}

const stateCell = {
    normal: 'normal',
    revealed: 'revealed',
    flag: 'flag'
}

let optionLevel = 1;

function changeLevel() {
    optionLevel++;
    if (optionLevel > 2)
        optionLevel = 0;
    switch (optionLevel) {
        case 0:
            updateLevel(babuLevel);
            break;
        case 1:
            updateLevel(knightLevel);
            break;
        case 2:
            updateLevel(kingLevel);
            break;
    }
}

function updateLevel(level) {
    minesCount = level.minesCount;
    rows = level.rows;
    cols = level.cols;
    resetGameButton();
}

// Función para crear el tablero de juego
function createBoard() {
    // Limpiar cualquier contenido existente
    gameElement.innerHTML = '';

    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i.toString());
            cell.setAttribute('data-col', j.toString());

            addCellEvents(cell);//agrega eventos de click a las celdas

            gameElement.appendChild(cell);
            gameBoard[i][j] = {
                element: cell,
                type: typeCell.null,
                state: stateCell.normal,
                revealed: false,
                flagged: false,
                adjacentMines: 0,
                row: i,
                col: j
            };
        }
    }
    const firstCell = document.querySelector('.cell');
    const cellWidth = firstCell.offsetWidth; // Obtiene el ancho de la celda en píxeles
    const cellHeight = firstCell.offsetHeight; // Obtiene la altura de la celda en píxeles

    // Ajustar las filas y columnas del grid con el tamaño calculado
    gameElement.style.gridTemplateRows = `repeat(${rows}, ${cellWidth}px)`;
    gameElement.style.gridTemplateColumns = `repeat(${cols}, ${cellHeight}px)`;
    plantMines();
    calculateAdjacentMines();
    revealMineHints();
}

function initializeBoard(row, col) {

    findVoidCell(row, col);
    calculateAdjacentMines();
    revealMineHints();
}

function findVoidCell(row = 0, col = 0) {
    if (gameBoard[row][col].type == typeCell.void) return;
    for (let i = 1; i < (rows - 1); i++) {
        for (let j = 1; j < (cols - 1); j++) {
            const element = gameBoard[i][j];
            if (element.type == typeCell.void) {
                updatePlantedMines(i - row, j - col);
                return;
            }
        }
    }
}

// Función para plantar minas usando la semilla
function plantMines() {
    let minesPlanted = 0;
    let rng = mulberry32(seed); // Generador de números aleatorios con semilla
    while (minesPlanted < minesCount) {
        let row = Math.floor(rng() * rows);
        let col = Math.floor(rng() * cols);
        let cell = gameBoard[row][col]
        if (cell.type == typeCell.null) {
            cell.type = typeCell.mine;
            minesPlanted++;
        }
    }
}
function updatePlantedMines(offsetRow = 0, offsetCol = 0) {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let fg = gameBoard[i][j];
            fg.type = typeCell.null;
            state = stateCell.normal;
            revealed = false;
            flagged = false;
            adjacentMines = 0;
        }
    }
    let minesPlanted = 0;
    let rng = mulberry32(seed); // Generador de números aleatorios con semilla
    while (minesPlanted < minesCount) {
        let row = Math.floor(rng() * rows);
        let col = Math.floor(rng() * cols);
        if (offsetRow != 0) {
            row = row - offsetRow;
            if (row >= rows) row = row - rows;
            if (row < 0) row = row + rows;
        }
        if (offsetCol != 0) {
            col = col - offsetCol;
            if (col >= cols) col = col - cols;
            if (col < 0) col = col + cols;
        }
        let cell = gameBoard[row][col]

        if (cell.type == typeCell.null) {
            cell.type = typeCell.mine;

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
            let cell = gameBoard[i][j];
            if (cell.type != typeCell.mine) {
                let adjacentMines = countAdjacentMines(i, j);
                if (adjacentMines == 0)
                    cell.type = typeCell.void;
                else
                    cell.type = typeCell.number;
                cell.adjacentMines = adjacentMines;
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
                if (gameBoard[newRow][newCol].type == typeCell.mine) {
                    count++;
                }
            }
        }
    }

    return count;
}