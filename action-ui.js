
const resetButton = document.getElementById('reset-button');
const hintButton = document.getElementById('hint-button');
const seedInput = document.getElementById('seed-input');
const themeToggleBtn = document.getElementById('theme-toggle');
const padlockToggleBtn = document.getElementById('padlock-toggle');
const levelBtn = document.getElementById('level-button');


let flagTimeout;
let flagPlaced = false;

let isMobile; //verifica si está usando un celular o una PC


function setActionsUI() {
    checkingMobileUI();
    document.oncontextmenu = disableContextmenu // deshabilita el menú contextual
    resetButton.addEventListener('mousedown', resetGameButton);
    hintButton.addEventListener('click', clickHintButton);
    seedInput.addEventListener('input', updateSeedInput);
    themeToggleBtn.addEventListener('click', toggleTheme);
    padlockToggleBtn.addEventListener('click', clickToglePadlock);
    levelBtn.addEventListener('click', clickLevelButton);
}

// Función para cambiar el tema
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    }
}

function initializeTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = '🌙';
    }
}


function clickToglePadlock() {
    updateSeedLock(!isSeedLocked);
    if (!isSeedLocked)
        resetGameButton();
}

function clickLevelButton() {
    changeLevel();
}

function addCellEvents(element) {
    if (isMobile) {
        element.addEventListener('pointerdown', handlePointerDown);
        element.addEventListener('pointerup', handlePointerUp);
        element.addEventListener('pointerleave', handlePointerUp);  // Para cuando se arrastra fuera de la celda
    } else {
        element.addEventListener('mousedown', pressCellButton);
    }
}

function resetGameButton() {
    resetPlay();
    resetGame();
}

function clickHintButton() {
    useHint();
}

function updateSeedInput() {

    fixedInput();
    let tempSeed = seedInput.value.padStart(3, '0');
    offsetSeed = tempSeed.slice(-2);
    seed = tempSeed.slice(0, -2);
    setGame();
    initializeBoard(offsetSeed[0], offsetSeed[1]);
    isInitialized = true;
    updateSeedLock(true);
}

function updateSeedLock(state) {
    // if(!isInitialized) isInitialized = true;
    updateFocusInputText(state);
    isSeedLocked = state;
    animToglePadLockButton();
}

function fixedInput() {
    let onlyNumbers = seedInput.value.replace(/\D/g, '');
    onlyNumbers = parseInt(onlyNumbers.padStart(1, '0'));
    seedInput.value = onlyNumbers;
}


//Si se presiona la celda desde una computadora
function pressCellButton(event) {
    if (event.button == 0)
        checkCell(event);
    else
        flagCell(event);
}

//Si se presiona la celda desde un celular
function handlePointerDown(event) {
    flagPlaced = false;  // Resetear el estado al presionar
    flagTimeout = setTimeout(() => {
        flagCell(event);  // Colocar la bandera
        flagPlaced = true;  // Marcar que la bandera ha sido colocada
    }, 150);  // Tiempo de espera reducido (en milisegundos)
}

function handlePointerUp(event) {
    if (!flagPlaced) {
        clearTimeout(flagTimeout);  // Cancela la acción si no se ha colocado la bandera
        checkCell(event);
    }
}
