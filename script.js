// DOM elements
const envelopeWrapper = document.getElementById("envelope-wrapper");
const openLetterBtn = document.getElementById("open-letter-btn");
const typewriterEl = document.getElementById("typewriter-text");
const musicToggle = document.getElementById("music-toggle");
const bgMusic = document.getElementById("bg-music");
const starCanvas = document.getElementById("star-canvas");
const ctx = starCanvas.getContext("2d");

let isMusicPlaying = false;

/* ========= STAR CANVAS ========= */
function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const stars = [];
const STAR_COUNT = 160;

function createStars() {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * starCanvas.width,
            y: Math.random() * starCanvas.height,
            radius: Math.random() * 1.5 + 0.2,
            alpha: Math.random(),
            twinkleSpeed: 0.005 + Math.random() * 0.02
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    for (const star of stars) {
        star.alpha += star.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1) star.alpha = 1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248, 250, 252, ${star.alpha})`;
        ctx.fill();
    }
    requestAnimationFrame(drawStars);
}

createStars();
drawStars();

/* ========= ENVELOPE OPEN + TYPEWRITER ========= */
openLetterBtn.addEventListener("click", () => {
    // Flap animation
    envelopeWrapper.classList.add("opened");

    // After flap opens, scroll to card & start typewriter
    setTimeout(() => {
        const cardSection = document.getElementById("card-section");
        cardSection.scrollIntoView({ behavior: "smooth", block: "start" });
        startTypewriter();
    }, 900);
});

// Typewriter
function startTypewriter() {
    const fullText = typewriterEl.getAttribute("data-full-text");
    typewriterEl.textContent = "";
    let idx = 0;

    function typeChar() {
        if (idx <= fullText.length) {
            typewriterEl.textContent = fullText.slice(0, idx);
            idx++;
            const char = fullText[idx - 1];
            const delay = char === "." || char === "!" || char === "?" ? 90 : 40;
            setTimeout(typeChar, delay);
        }
    }
    typeChar();
}

/* ========= MUSIC TOGGLE ========= */
musicToggle.addEventListener("click", async () => {
    try {
        if (!isMusicPlaying) {
            await bgMusic.play();
            isMusicPlaying = true;
            musicToggle.textContent = "Pause Music ⏸️";
            musicToggle.classList.remove("paused");
        } else {
            bgMusic.pause();
            isMusicPlaying = false;
            musicToggle.textContent = "Play Music 🎵";
            musicToggle.classList.add("paused");
        }
    } catch (err) {
        console.error("Music play error:", err);
    }
});

// Start button in "paused" style
musicToggle.classList.add("paused");

