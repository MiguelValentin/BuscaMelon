
let cellsToReveal = [];
let isSeedLocked = false;

let isInitialized = false;

function checkCell(event) {

    if (isGameOver) return;
    let cell = getCell(event);
    if (!isInitialized) initializeCell(cell.row, cell.col);
    if (cell.state != stateCell.normal) return;
    if (cell.type == typeCell.mine) {
        revealAllMines();
        return;
    }
    cell.state = stateCell.revealed;
    cellsToReveal.push(cell);
    if (!counterStarted) initializeCounter();
    if (cell.type == typeCell.void) {
        revealAdjacentCells(cell.row, cell.col);
    }
    revealCells();
    checkWinConditions();
}

function initializeCell(row, col) {
    isInitialized = true;
    initializeBoard(row, col);
    setSeedInputText(row, col);
}

function terminateGame() {
    clearInterval(timer);
    isGameOver = true;
}

function revealCells() {
    cellPlay();
    idleAnim();
    for (let index = 0; index < cellsToReveal.length; index++) {
        const element = cellsToReveal[index];
        revealCell(element);
    }
    cellsToReveal = [];
}

function revealCell(cell) {
    cell.element.classList.add('revealed');
    cell.state = stateCell.revealed;
    showSafeCell(cell);
}

function initializeCounter() {
    counterStarted = true;
    startTime = new Date().getTime();
    timer = setInterval(updateTimer, 1000);

}

function checkWinConditions() {

    if (minesRemaining != 0)
        return;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = gameBoard[i][j];
            if (cell.state == stateCell.normal || (cell.state != stateCell.flag && cell.type == typeCell.mine)) return;
        }
    }
    winGame();
}

function winGame() {
    if (isGameOver) return;
    terminateGame();
    winPlay();
    showWinPopup();
}

function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = parseInt(row) + i;
            let newCol = parseInt(col) + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                let adjacentCell = gameBoard[newRow][newCol];
                if (adjacentCell.state != stateCell.revealed && adjacentCell.type != typeCell.mine)
                    checkCell({ target: adjacentCell.element });
            }
        }
    }
}

function flagCell(event) {
    // console.log('click');
    if (isGameOver) return;
    let cell = getCell(event);
    if (minesRemaining == 0 && cell.state != stateCell.flag)
        return;
    if (cell.state != stateCell.revealed) {
        cell.element.classList.toggle('flagged'); // le agrega o le quita la clase flagged
        flagPlay();
        if (cell.state == stateCell.flag) {
            cell.state = stateCell.normal;
            minesRemaining++;
        } else {
            cell.state = stateCell.flag;
            minesRemaining--;
        }
        minesCounterElement.textContent = formatNumber(minesRemaining);
    }
    flagAnim();
    checkWinConditions();
}
let minesToReveal = [];
function revealAllMines() {
    if (isGameOver) return;
    terminateGame();
    loseAnim();
    minesToReveal = [];
    gameOverPlay();
    // Recolecta todas las minas en una lista
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = gameBoard[i][j];
            if (cell.type == typeCell.mine) {

                minesToReveal.push(cell);
            }
        }
    }
    function revealNextMine(index) {
        if (index >= minesToReveal.length) return;
        let cell = minesToReveal[index];
        if (cell.state == stateCell.flag) cell.element.classList.remove('flagged');
        explosionPlay();
        if (cell.state != stateCell.revealed) {
            cell.state = stateCell.revealed;
            cell.element.classList.add('mine', 'exploding'); // Añadir la clase 'exploding'
        }
        setTimeout(() => {
            revealNextMine(index + 1);
        }, 50); // Duración de la animación, ajustable

    }
    // Inicia la revelación secuencial
    revealNextMine(0);
}