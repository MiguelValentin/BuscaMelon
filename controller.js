let cellsToReveal = [];
let isSeedLocked = false;

let isInitialized = false;

function checkCell(event) {
    if (isGameOver) return;
    let cell = getCell(event);

    if (!isInitialized) initializeCell(cell.row, cell.col);
    // Si la celda ya está revelada, se intenta hacer "chord"(liberar celdas adyacentes que no tengan minas)
    if (cell.state === stateCell.revealed) {
        chordCell(cell);
        return;
    }
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
}

function cellAction(event) {
    checkCell(event);
    if (cellsToReveal.length === 0) return;
    revealCells();
    checkWinConditions();
}

function getAdjacentCells(cell) {
    const adjacentCells = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            // Ignora la propia celda
            if (i === 0 && j === 0) continue;
            const newRow = cell.row + i;
            const newCol = cell.col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                adjacentCells.push(gameBoard[newRow][newCol]);
            }
        }
    }
    return adjacentCells;
}

// Función que realiza el "chord" en una celda revelada
function chordCell(cell) {
    const adjacentCells = getAdjacentCells(cell);
    // Cuenta las celdas adyacentes que están marcadas como bandera
    const flaggedCount = adjacentCells.filter(adj => adj.state === stateCell.flag).length;

    // Solo procede si la cantidad de banderas coincide con el número indicado en la celda
    if (flaggedCount !== cell.adjacentMines) return;

    // Revela cada celda adyacente que aún no se haya revelado
    adjacentCells.forEach(adjCell => {
        if (adjCell.state === stateCell.normal) {
            checkCell({ target: adjCell.element });
        }
    });
    const board = document.getElementById('game');
    if (board && cellsToReveal.length >= 1) {
        // board.classList.add('chord-effect');
        // setTimeout(() => board.classList.remove('chord-effect'), 300);
    }
}

function useSearch() {
    // if (!hintAvailable || hintUsed || isGameOver) return;
    if (isGameOver || !isInitialized) return;
    let tempContentVoids = gameContent.voids.filter((normalVoids) => normalVoids.state === stateCell.normal);
    if (tempContentVoids.length > 0) {
        let nVoid = tempContentVoids[Math.floor(Math.random() * tempContentVoids.length)];
        nVoid.element.classList.add('hint');
        cellAction({ target: nVoid.element });
        startTime -= 100000;

        return;
    }

    // Buscar celdas reveladas con número para encontrar pistas seguras
    const safeCells = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = gameBoard[i][j];
            if (cell.state === stateCell.revealed &&
                cell.type === typeCell.number &&
                cell.adjacentMines > 0) {
                safeCells.push(...getAdjacentSafeCells(cell));
            }
        }
    }

    // Seleccionar una celda segura al azar
    if (safeCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * safeCells.length);
        const safeCell = safeCells[randomIndex];
        safeCell.element.classList.add('hint');
        cellAction({ target: safeCell.element });
        startTime -= 100000;
    }

}

function getAdjacentSafeCells(cell) {
    return getAdjacentCells(cell).filter(adjCell =>
        adjCell.state === stateCell.normal &&
        adjCell.type !== typeCell.mine
    );
}

function initializeCell(row, col) {
    isInitialized = true;
    initializeBoard(row, col);
    setSeedInputText(row, col);
    // setTimeout(() => showHint(), 200);

}

function showHint() {
    let tempContentVoids = gameContent.voids.filter((normalVoids) => normalVoids.state === stateCell.normal);
    if (tempContentVoids.length === 0) return;
    let nVoid = tempContentVoids[Math.floor(Math.random() * tempContentVoids.length)];
    nVoid.element.classList.add('hint');
}

function terminateGame() {
    clearInterval(timer);
    isGameOver = true;
}

function revealCells() {
    cellsToReveal.length > 1 ? cellsGroupPlay() : cellPlay();
    idleAnim();
    for (let index = 0; index < cellsToReveal.length; index++) {
        const element = cellsToReveal[index];
        revealCell(element);
    }
    if (cellsToReveal.length >= 4) {
        const board = document.getElementById('game');
        if (board) {
            board.classList.add('reveal');
            setTimeout(() => board.classList.remove('reveal'), 300);
        }
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

function flagCellAction(event) {
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

    //efecto de explosión en el tablero 
    const board = document.getElementById('game');
    if (board) {
        board.classList.add('board-explosion');
        setTimeout(() => board.classList.remove('board-explosion'), 500);
    }
}