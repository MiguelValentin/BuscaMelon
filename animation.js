let idleIconAnim = '😊';
let winIconAnim = '😆';
let loseIconAnim = '😭';
let flagIconAnim = '🫣';
let revealedIconAmin = '😬';

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
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = gameBoard[i][j];
            cell.element.textContent = '';
            if (cell.type == typeCell.mine) {
                cell.element.textContent = '';
            }
        }
    }
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

function addColorTextCell(cell) {
    cell.element.classList.remove('one');
    cell.element.classList.remove('two');
    cell.element.classList.remove('three');
    cell.element.classList.remove('four');
    cell.element.classList.remove('five');
    cell.element.classList.remove('six');
    cell.element.classList.remove('seven');
    cell.element.classList.remove('eight');
    // cell.element.classList.remove('one' && 'two' && 'three' && 'four' && 'five');
    switch (cell.adjacentMines) {
        case 1:
            cell.element.classList.add('one');
            break;
        case 2:
            cell.element.classList.add('two');
            break;
        case 3:
            cell.element.classList.add('three');
            break;
        case 4:
            cell.element.classList.add('four');
            break;
        case 5:
            cell.element.classList.add('five');
            break;
        case 6:
            cell.element.classList.add('six');
            break;
        case 7:
            cell.element.classList.add('seven');
            break;
        case 8:
            cell.element.classList.add('eight');
            break;
        default:
            break;
    }
}