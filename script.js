// --- CONFIGURATION --
const CORRECT_PASSWORD = "dream"; 
const PASSWORD_HINT = "psst... the password is 'dream'";

// URLs of your 50 art pieces
const galleryImages = [
    // "image1.jpg", "image2.jpg", etc... Add your 50 pieces here
];

// Liminal Error Messages
const liminalMessages = [
    "You have been here before.",
    "There is nothing left to click.",
    "Are you sure you are awake?",
    "The walls are breathing.",
    "It is looking at you.",
    "Please stop tapping the glass."
];

// --- SOUND EFFECT LOGIC ---
const clickAudio = document.getElementById('ui-click-sound');

// Play sound function
function playClickSound() {
    if (clickAudio) {
        clickAudio.currentTime = 0; // Reset sound to start so rapid clicks overlap correctly
        clickAudio.play().catch(e => {
            // Browsers sometimes block audio before a user interacts with the page, this catches the silent error
        });
    }
}

// Global listener: If you click an icon, button, link, start menu, or gallery image, it plays the sound
document.addEventListener('click', (e) => {
    const isClickable = e.target.closest('.icon, button, a, #start-btn, #clock, #user-avatar, .gallery-item');
    if (isClickable) {
        playClickSound();
    }
});


// --- LOGIN LOGIC ---
const avatarBtn = document.getElementById('user-avatar');
const passInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');

// Click icon for password hint
avatarBtn.addEventListener('click', () => alert(PASSWORD_HINT));

// Verify password
loginBtn.addEventListener('click', () => {
    if(passInput.value.toLowerCase() === CORRECT_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        resetScreensaver(); 
    } else {
        document.getElementById('login-error').style.opacity = 1;
        passInput.value = "";
    }
});

// --- WINDOW MANAGEMENT & RAPID CLICKS ---
let clickCount = 0;
let clickTimer = null;

function openWindow(id) {
    // Bring window to front
    const win = document.getElementById(id);
    win.classList.remove('hidden');
    
    // Simple z-index bump to make clicked windows appear on top
    const allWindows = document.querySelectorAll('.window');
    allWindows.forEach(w => w.style.zIndex = 100);
    win.style.zIndex = 101;
    
    trackClicks();
}

function closeWindow(id) {
    document.getElementById(id).classList.add('hidden');
}

function trackClicks() {
    clickCount++;
    clearTimeout(clickTimer);
    
    if(clickCount >= 5) {
        triggerLiminalError();
        clickCount = 0;
    }
    
    clickTimer = setTimeout(() => { clickCount = 0; }, 2000);
}

function triggerLiminalError() {
    const errorWin = document.getElementById('error-message');
    const errorTxt = document.getElementById('error-text');
    const randomMsg = liminalMessages[Math.floor(Math.random() * liminalMessages.length)];
    
    errorTxt.innerText = randomMsg;
    errorWin.classList.remove('hidden');
    errorWin.style.zIndex = 999; // Ensure error is always on top
}

// --- START MENU ---
document.getElementById('start-btn').addEventListener('click', () => {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('hidden');
});

// Hide start menu if clicking elsewhere
document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-btn') && !e.target.closest('#start-menu')) {
        document.getElementById('start-menu').classList.add('hidden');
    }
});

// --- GLITCHING CLOCK & SECRET CLICK LOGIC ---
const clock = document.getElementById('clock');
const glitchTimes = ["00:00 AM", "3:33 AM", "10:21 AM"];
let isGlitching = false; // Tracks if the clock is currently in a glitch state

// Only open the hidden window if they click while isGlitching is true
clock.addEventListener('click', () => {
    if (isGlitching) {
        openWindow('window-hidden');
    }
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

setInterval(() => {
    // 10% chance roughly once every 5-10 seconds
    if(Math.random() < 0.1) {
        isGlitching = true; // The window of opportunity opens
        const randomGlitch = glitchTimes[Math.floor(Math.random() * glitchTimes.length)];
        clock.innerText = randomGlitch;
        
        // Glitch lasts exactly 1 second before snapping back
        setTimeout(() => {
            isGlitching = false; // The window closes
            clock.innerText = updateClock();
        }, 1000);
    } else {
        if (!isGlitching) {
            clock.innerText = updateClock();
        }
    }
}, 1000);

// --- POPULATE THE MESSY GALLERY ---
const grid = document.getElementById('gallery-grid');
for(let i = 0; i < 50; i++) {
    let img = document.createElement('img');
    img.src = galleryImages[i] || 'https://via.placeholder.com/70/ccc/999?text=Art'; // fallback
    img.className = 'gallery-item';
    
    // Random rotation for the messy look
    let randomRot = Math.floor(Math.random() * 30) - 15; 
    img.style.transform = `rotate(${randomRot}deg)`;
    
    img.onclick = () => {
        document.getElementById('viewer-img').src = img.src;
        openWindow('photo-viewer');
    };
    grid.appendChild(img);
}

// --- SCREENSAVER LOGIC ---
let screensaverTimeout;
const screensaver = document.getElementById('screensaver');
const logo = document.getElementById('bounce-logo');

let x = 0, y = 0, dx = 2, dy = 2;
let animationFrame;

function resetScreensaver() {
    clearTimeout(screensaverTimeout);
    screensaver.classList.add('hidden');
    cancelAnimationFrame(animationFrame);
    
    // 10 seconds of inactivity
    screensaverTimeout = setTimeout(showScreensaver, 10000); 
}

function showScreensaver() {
    screensaver.classList.remove('hidden');
    x = Math.random() * (window.innerWidth - 80);
    y = Math.random() * (window.innerHeight - 80);
    animateLogo();
}

function animateLogo() {
    if(x + 80 >= window.innerWidth || x <= 0) dx = -dx;
    if(y + 80 >= window.innerHeight || y <= 0) dy = -dy;
    x += dx; y += dy;
    logo.style.left = x + 'px';
    logo.style.top = y + 'px';
    animationFrame = requestAnimationFrame(animateLogo);
}

// Wake up triggers
['mousemove', 'touchstart', 'click', 'scroll'].forEach(evt => {
    document.addEventListener(evt, resetScreensaver);
});
