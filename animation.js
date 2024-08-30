const idleIconAnim = '😊';
const winIconAnim = '😆';
const loseIconAnim = '😭';
const flagIconAnim = '🫣';
const revealedIconAmin = '😬';

function updateEmoji(emoji) {
    resetButton.textContent = emoji;
}

function idleAnim() {
    updateEmoji(idleIconAnim);
}

function winAnim() {
    updateEmoji(winIconAnim);
}

function loseAnim() {
    updateEmoji(loseIconAnim);
}

function flagAnim() {
    updateEmoji(flagIconAnim)
}

function revealedAnim() {
    updateEmoji(revealedIconAmin)
}

function showSafeCell(cell) {
    cell.element.textContent = cell.adjacentMines > 0 ? cell.adjacentMines : '';
}

function clearSeedInputText() {
    seedInput.value = '';
}

function setSeedInputText(row, col) {
    seedInput.value = seed + '' + row + col;
}

function updateFocusInputText(state) {
    if (state)
        seedInput.setAttribute('data-focused', 'true');
    else
        seedInput.removeAttribute('data-focused');
}

function animToglePadLockButton() {
    if (isSeedLocked) {
        padlockToggleBtn.setAttribute('data-focused', 'true')
        padlockToggleBtn.textContent = '🔒';
    } else {
        padlockToggleBtn.removeAttribute('data-focused')
        padlockToggleBtn.textContent = '🔓';
    }
}

function revealMineHints() {
    gameBoard.forEach(
        row => row.forEach(
            cell => cell.type === typeCell.mine ?
                (cell.element.textContent = 'M') : cell.element.textContent = '')
    );
}

function showWinPopup() {

    winAnim();

    const winPopup = document.getElementById('win-popup');
    winPopup.style.display = 'flex'; // Mostrar el popup
    // Añadir evento para cerrar el popup
    const closeBtn = document.getElementById('close-popup');
    closeBtn.addEventListener('click', () => {
        winPopup.style.display = 'none';
    });
    animConfetti();
}

function animConfetti() {
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

// grupo de clases css para los números de minas
const MINE_CLASSES = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];

function addColorTextCell(cell) {
    cell.element.classList.remove(...MINE_CLASSES);// Elimina todas las clases css de tipo número antes de agregar el nuevo
    cell.element.classList.add(MINE_CLASSES[cell.adjacentMines - 1]);// Agrega la clase css para su respectivo color
}