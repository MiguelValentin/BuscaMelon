
// Función para actualizar el temporizador
function updateTimer() {
    // if (isGameOver)
    //     return;
    let currentTime = Math.floor((new Date().getTime() - startTime) / 1000);
    // console.log(currentTime);
    if (currentTime < 1000)
        timerElement.textContent = formatNumber(currentTime);
}

// Función para formatear números a 3 dígitos
function formatNumber(number) {
    return number.toString().padStart(3, '0');
}

function generateRandomSeed() {
    const randonNumber = Math.floor(Math.random() * 89999 + 10000);
    seed = randonNumber;
    console.log(seed);
}

function initValues() {
    isInitialized = false;
    counterStarted = false;
    isGameOver = false;
    gameBoard = [];
    minesRemaining = minesCount;
    minesCounterElement.textContent = formatNumber(minesRemaining);
    timerElement.textContent = defaultTimer;
}

function getCell(event) {
    let row = event.target.getAttribute('data-row');
    let col = event.target.getAttribute('data-col');
    return gameBoard[row][col];
}

function checkingMobileUI() {
    let nav = navigator.userAgent;

    if (nav.match(/Android/i) || nav.match(/webOS/i) || nav.match(/iPhone/i) || nav.match(/iPad/i)) {
        isMobile = true;
    } else {
        isMobile = false;
    }
}

function disableContextmenu() {
    return false;
}