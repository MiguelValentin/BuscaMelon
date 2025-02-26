
// Función para actualizar el temporizador
function updateTimer() {
    // if (isGameOver)
    //     return;
    let currentTime = Math.floor((new Date().getTime() - startTime) / 1000);

    if (currentTime < 1000)
        timerElement.textContent = formatNumber(currentTime);
    else
        timerElement.textContent = 999;
}

// Función para formatear números a 3 dígitos
function formatNumber(number) {
    return number.toString().padStart(3, '0');
}

function generateRandomSeed() {
    if (isSeedLocked) return;
    const randonNumber = Math.floor(Math.random() * 89999 + 10000);
    seed = randonNumber;
    console.log(seed);
}

function initValues() {
    if (!isSeedLocked)
        isInitialized = false;
    minesToReveal = [];
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

function particleAnim() {
    if (isMobile) return;
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: undefined, y: undefined, radius: 150 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    function initParticles() {
        particles = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            baseX: Math.random() * canvas.width,
            baseY: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            density: Math.random() * 30 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        }));
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cambiamos el listener al documento en lugar del canvas
    document.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX; // Usamos clientX en lugar de x
        mouse.y = event.clientY; // Usamos clientY en lugar de y
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            // Movimiento autónomo
            particle.baseX += particle.vx;
            particle.baseY += particle.vy;

            // Rebotar en los bordes
            if (particle.baseX < 0 || particle.baseX > canvas.width) {
                particle.vx *= -1;
                particle.baseX = Math.max(0, Math.min(canvas.width, particle.baseX));
            }
            if (particle.baseY < 0 || particle.baseY > canvas.height) {
                particle.vy *= -1;
                particle.baseY = Math.max(0, Math.min(canvas.height, particle.baseY));
            }

            // Interacción con el mouse
            let dx = mouse.x - particle.x;
            let dy = mouse.y - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;

            const maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;

            if (distance < mouse.radius && mouse.x !== undefined) {
                particle.x -= forceDirectionX * force * particle.density;
                particle.y -= forceDirectionY * force * particle.density;
            } else {
                if (particle.x !== particle.baseX) {
                    dx = particle.x - particle.baseX;
                    particle.x -= dx / 10;
                }
                if (particle.y !== particle.baseY) {
                    dy = particle.y - particle.baseY;
                    particle.y -= dy / 10;
                }
            }

            // Dibujar partícula
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(182, 65, 250, 0.8)';
            ctx.fill();

            // Dibujar conexiones
            particles.forEach(other => {
                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(182, 65, 250, ${0.2 - distance / 500})`;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }
    animate();
}

setTimeout(() => particleAnim(), 100);
