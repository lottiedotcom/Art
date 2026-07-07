// --- CONFIGURATION ---
const CORRECT_PASSWORD = "dream"; // Set your cute password here
const PASSWORD_HINT = "psst... the password is 'dream'";

// Insert the URLs of your 50 art pieces inside this array
const galleryImages = [
    "YOUR_IMAGE_1.jpg", 
    "YOUR_IMAGE_2.jpg",
    // ... add all 50 here. For testing, it will just duplicate a placeholder if array is empty.
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

// --- LOGIN LOGIC ---
const avatarBtn = document.getElementById('user-avatar');
const passInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');

avatarBtn.addEventListener('click', () => alert(PASSWORD_HINT));

loginBtn.addEventListener('click', () => {
    if(passInput.value.toLowerCase() === CORRECT_PASSWORD) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('desktop').classList.remove('hidden');
        resetScreensaver(); // start the timer once logged in
    } else {
        document.getElementById('login-error').style.opacity = 1;
        passInput.value = "";
    }
});

// --- WINDOW MANAGEMENT & RAPID CLICKS ---
let clickCount = 0;
let clickTimer = null;

function openWindow(id) {
    document.getElementById(id).classList.remove('hidden');
    trackClicks();
}

function closeWindow(id) {
    document.getElementById(id).classList.add('hidden');
}

function trackClicks() {
    clickCount++;
    clearTimeout(clickTimer);
    
    // If user clicks 5 times within 2 seconds
    if(clickCount >= 5) {
        triggerLiminalError();
        clickCount = 0;
    }
    
    clickTimer = setTimeout(() => {
        clickCount = 0;
    }, 2000);
}

function triggerLiminalError() {
    const errorWin = document.getElementById('error-message');
    const errorTxt = document.getElementById('error-text');
    const randomMsg = liminalMessages[Math.floor(Math.random() * liminalMessages.length)];
    
    errorTxt.innerText = randomMsg;
    errorWin.classList.remove('hidden');
}

// --- START MENU ---
document.getElementById('start-btn').addEventListener('click', () => {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('hidden');
});

// --- GLITCHING CLOCK LOGIC ---
const clock = document.getElementById('clock');
const glitchTimes = ["00:00 AM", "3:33 AM", "10:21 AM"];

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

// Every 1 second, check if we should glitch
setInterval(() => {
    // 10% chance to glitch every second (roughly once every 5-10 seconds)
    if(Math.random() < 0.1) {
        const randomGlitch = glitchTimes[Math.floor(Math.random() * glitchTimes.length)];
        clock.innerText = randomGlitch;
        clock.style.color = "red"; 
        
        // Snap back to real time after 1 second
        setTimeout(() => {
            clock.innerText = updateClock();
            clock.style.color = "white";
        }, 1000);
    } else {
        if(clock.style.color !== "red") {
            clock.innerText = updateClock();
        }
    }
}, 1000);

// --- POPULATE THE MESSY GALLERY ---
const grid = document.getElementById('gallery-grid');
// If you don't have 50 URLs yet, this loop generates placeholders so you can see the layout
for(let i = 0; i < 50; i++) {
    let img = document.createElement('img');
    img.src = galleryImages[i] || 'https://via.placeholder.com/60/ccc/999?text=Art'; // fallback
    img.className = 'gallery-item';
    
    // Add some random rotation to make it look "messy"
    let randomRot = Math.floor(Math.random() * 20) - 10; 
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

let x = 0, y = 0, dx = 2, dy = 2; // Speed and position
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

// Listeners to wake up from screensaver
['mousemove', 'touchstart', 'click', 'scroll'].forEach(evt => {
    document.addEventListener(evt, resetScreensaver);
});

