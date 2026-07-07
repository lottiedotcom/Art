// --- CONFIGURATION ---
const CORRECT_PASSWORD = "dream"; 
const PASSWORD_HINT = "psst... the password is 'dream'";

// --- ARTWORK DATA ---
// Add all 50 pieces here! Make sure to put your high-quality .jpg names in the src.
const galleryData = [
    {
        src: "1.jpg", 
        title: "soul",
        description: "em",
        kofiLink: "YOUR_KOFI_LINK_HERE"
    },
    {
        src: "circle_02.jpg", 
        title: "Circle 02",
        description: "A continuation of the series. I really love the colors in this one.",
        kofiLink: "YOUR_KOFI_LINK_HERE"
    }
    
    // Just copy and paste that block format above for all 50 pieces!
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

function playClickSound() {
    if (clickAudio) {
        clickAudio.currentTime = 0; 
        clickAudio.play().catch(e => { });
    }
}

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

avatarBtn.addEventListener('click', () => alert(PASSWORD_HINT));

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
    const win = document.getElementById(id);
    win.classList.remove('hidden');
    
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
    errorWin.style.zIndex = 999; 
}

// --- START MENU ---
document.getElementById('start-btn').addEventListener('click', () => {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#start-btn') && !e.target.closest('#start-menu')) {
        document.getElementById('start-menu').classList.add('hidden');
    }
});

// --- GLITCHING CLOCK & SECRET CLICK LOGIC ---
const clock = document.getElementById('clock');
const glitchTimes = ["00:00 AM", "3:33 AM", "10:21 AM"];
let isGlitching = false; 

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
    if(Math.random() < 0.1) {
        isGlitching = true; 
        const randomGlitch = glitchTimes[Math.floor(Math.random() * glitchTimes.length)];
        clock.innerText = randomGlitch;
        
        setTimeout(() => {
            isGlitching = false; 
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
    let data = galleryData[i] || {}; 
    
    let img = document.createElement('img');
    img.src = data.src || 'https://via.placeholder.com/70/ccc/999?text=Art'; 
    img.className = 'gallery-item';
    
    let randomRot = Math.floor(Math.random() * 30) - 15; 
    img.style.transform = `rotate(${randomRot}deg)`;
    
    img.onclick = () => {
        document.getElementById('viewer-img').src = img.src;
        
        const detailsContainer = document.getElementById('viewer-details');
        const titleEl = document.getElementById('viewer-title');
        const descEl = document.getElementById('viewer-desc');
        const kofiEl = document.getElementById('viewer-kofi');
        
        if (data.description || data.kofiLink || data.title) {
            detailsContainer.classList.remove('hidden');
            titleEl.innerText = data.title || "Unknown Art";
            descEl.innerText = data.description || "";
            
            if(data.kofiLink) {
                kofiEl.href = data.kofiLink;
                kofiEl.classList.remove('hidden');
            } else {
                kofiEl.classList.add('hidden');
            }
        } else {
            detailsContainer.classList.add('hidden');
        }

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

['mousemove', 'touchstart', 'click', 'scroll'].forEach(evt => {
    document.addEventListener(evt, resetScreensaver);
});

