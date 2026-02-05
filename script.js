// ===================================
// STATE MANAGEMENT
// ===================================
const AppState = {
    currentScreen: 'screen-landing',
    heartsCollected: 0,
    totalHeartsNeeded: 10,  // 10 taps = full heart (maps to 6 sprite levels)
    heartLevel: 0,          // 0-5 sprite levels
    noClickCount: 0,
    hasMusic: false,
    userName: '',
};

// No response messages (loops infinitely)
const noResponses = [
    "You have no choice now, cutie 😌💘",
    "Please accept 🥺👉👈",
    "Accept already 😤💖"
];

// Heart fill messages (emotional progression)
const heartMessages = [
    "Warming up the heart 💗",
    "Feeling the love 💕",
    "Getting warmer 🔥",
    "Almost there 💖",
    "So close! ✨",
    "Heart is full! 💝"
];

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Get optional user name from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    AppState.userName = urlParams.get('name') || localStorage.getItem('valentineName') || '';

    // Create floating background hearts
    createBackgroundHearts();

    // Setup event listeners
    setupEventListeners();

    // Show landing screen
    goToScreen('screen-landing');
}

// ===================================
// BACKGROUND HEARTS ANIMATION
// ===================================
function createBackgroundHearts() {
    const container = document.getElementById('bgHearts');
    const heartColors = ['💗', '💜', '💖', '💝', '💕'];

    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart';
        heart.textContent = heartColors[Math.floor(Math.random() * heartColors.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 8 + 's';
        heart.style.animationDuration = (8 + Math.random() * 4) + 's';
        heart.style.fontSize = (20 + Math.random() * 20) + 'px';
        container.appendChild(heart);
    }
}

// ===================================
// SCREEN NAVIGATION
// ===================================
function goToScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        AppState.currentScreen = screenId;

        // Trigger screen-specific initialization
        onScreenEnter(screenId);
    }
}

function onScreenEnter(screenId) {
    switch (screenId) {
        case 'screen-interaction':
            startInteractionPhase();
            break;
        case 'screen-question':
            resetNoClickCount();
            break;
        case 'screen-note':
            typeLoveNote();
            break;
        case 'screen-finale':
            startFinaleAnimation();
            break;
    }
}

// ===================================
// EVENT LISTENERS
// ===================================
function setupEventListeners() {
    // Landing "No" button
    const landingNoBtn = document.getElementById('landingNoBtn');
    if (landingNoBtn) {
        landingNoBtn.addEventListener('click', (e) => {
            e.target.style.animation = 'wiggle 0.5s ease';
            setTimeout(() => {
                e.target.style.animation = '';
            }, 500);
        });
    }

    // Question screen buttons
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    if (yesBtn) {
        yesBtn.addEventListener('click', handleYesClick);
    }

    if (noBtn) {
        noBtn.addEventListener('click', handleNoClick);
    }
}

// ===================================
// INTERACTION PHASE
// ===================================
function startInteractionPhase() {
    AppState.heartsCollected = 0;
    AppState.heartLevel = 0;

    // Initialize heart fill sprite
    const heartFill = document.getElementById('heartFill');
    if (heartFill) {
        heartFill.setAttribute('data-level', '0');
        heartFill.classList.remove('pulse', 'wobble', 'full');
    }

    updateHeartProgress();
    spawnInteractiveHearts();
}

function spawnInteractiveHearts() {
    const area = document.getElementById('interactiveArea');
    area.innerHTML = ''; // Clear previous hearts

    const heartEmojis = ['💗', '💖', '💕', '💝', '💜'];
    const numHearts = 5; // Spawn 5 hearts at a time

    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'tap-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = (10 + Math.random() * 80) + '%';
        heart.style.top = (10 + Math.random() * 80) + '%';

        heart.addEventListener('click', function (e) {
            collectHeart(this, e);
        });

        area.appendChild(heart);
    }
}

function collectHeart(heartElement, event) {
    // Prevent multiple clicks
    if (heartElement.classList.contains('collected')) return;

    heartElement.classList.add('collected');
    AppState.heartsCollected++;

    // Create burst effect at click position
    createHeartBurst(event.clientX, event.clientY);

    updateHeartProgress();

    // Remove heart after animation
    setTimeout(() => {
        heartElement.remove();

        // Check if more hearts needed
        if (AppState.heartsCollected < AppState.totalHeartsNeeded) {
            // Spawn a new heart
            spawnInteractiveHearts();
        } else {
            // Complete interaction phase
            completeInteractionPhase();
        }
    }, 600);
}

function updateHeartProgress() {
    const heartFill = document.getElementById('heartFill');
    const heartText = document.getElementById('heartText');

    if (!heartFill) return;

    // Calculate heart level (0-5) from hearts collected (0-10)
    // Level changes at: 0, 2, 4, 6, 8, 10 hearts
    const newLevel = Math.min(5, Math.floor(AppState.heartsCollected / 2));

    // Check if level increased
    if (newLevel > AppState.heartLevel) {
        AppState.heartLevel = newLevel;
        heartFill.setAttribute('data-level', newLevel.toString());

        // Trigger pulse animation
        heartFill.classList.add('pulse');
        setTimeout(() => heartFill.classList.remove('pulse'), 350);

        // Trigger wobble for extra delight
        heartFill.classList.add('wobble');
        setTimeout(() => heartFill.classList.remove('wobble'), 600);

        // Update message
        if (heartText) {
            heartText.textContent = heartMessages[newLevel];
            if (newLevel >= 4) {
                heartText.classList.add('excited');
            }
        }

        // Full heart celebration
        if (newLevel === 5) {
            heartFill.classList.add('full');
        }
    }
}

function completeInteractionPhase() {
    const speech = document.getElementById('mascotSpeech');
    if (speech) {
        speech.textContent = 'Heart warming up 💕';
    }

    setTimeout(() => {
        goToScreen('screen-question');
    }, 1500);
}

function createHeartBurst(x, y) {
    const burst = document.createElement('div');
    burst.className = 'heart-burst';
    burst.textContent = '💖';
    burst.style.left = x + 'px';
    burst.style.top = y + 'px';
    document.body.appendChild(burst);

    setTimeout(() => {
        burst.remove();
    }, 1000);
}

// ===================================
// QUESTION SCREEN
// ===================================
function resetNoClickCount() {
    AppState.noClickCount = 0;
    const bubble = document.getElementById('noResponseBubble');
    if (bubble) {
        bubble.style.display = 'none';
    }
}

function handleNoClick() {
    const bubble = document.getElementById('noResponseBubble');
    if (!bubble) return;

    // Get message from infinite loop array
    const messageIndex = AppState.noClickCount % noResponses.length;
    const message = noResponses[messageIndex];

    bubble.textContent = message;
    bubble.style.display = 'block';

    // Trigger animation
    bubble.style.animation = 'none';
    setTimeout(() => {
        bubble.style.animation = 'fadeInUp 0.5s ease';
    }, 10);

    AppState.noClickCount++;
}

function handleYesClick() {
    // Create hearts burst effect
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createHeartBurst(x, y);
        }, i * 100);
    }

    // Advance to love note after burst animation
    setTimeout(() => {
        goToScreen('screen-note');
    }, 2000);
}

// ===================================
// LOVE NOTE TYPING ANIMATION
// ===================================
function typeLoveNote() {
    const noteContent = document.getElementById('noteContent');
    if (!noteContent) return;

    // Construct personalized message
    let message = "Happy Valentine's Day 💖\n\n";

    if (AppState.userName) {
        message += `Dear ${AppState.userName},\n\n`;
    }

    message += "You make ordinary days feel special 🌷\n\n";
    message += "Every moment with you is a gift ✨\n\n";
    message += "Thank you for being you 💝";

    // Type out the message
    noteContent.textContent = '';
    let charIndex = 0;

    const typingInterval = setInterval(() => {
        if (charIndex < message.length) {
            noteContent.textContent += message[charIndex];
            charIndex++;
        } else {
            clearInterval(typingInterval);
        }
    }, 50); // 50ms per character
}

// ===================================
// FINALE SCREEN
// ===================================
function startFinaleAnimation() {
    createConfetti();

    // Continuous confetti
    const confettiInterval = setInterval(() => {
        createConfetti();
    }, 500);

    // Store interval for cleanup
    if (!window.finaleInterval) {
        window.finaleInterval = confettiInterval;
    }
}

function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    const colors = ['#FFB6C1', '#DDA0DD', '#FFF4E6', '#FFE4E1', '#E6E6FA'];
    const shapes = ['💗', '💜', '💖', '💝', '✨', '⭐'];

    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';

        // Randomly use emoji or colored div
        if (Math.random() > 0.5) {
            confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
            confetti.style.fontSize = (15 + Math.random() * 15) + 'px';
        } else {
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }

        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';

        container.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// ===================================
// MUSIC TOGGLE (Optional)
// ===================================
function toggleMusic() {
    // Since this is client-side only with no backend,
    // we'll just show a message that music would play here
    const btn = document.getElementById('musicBtn');

    if (!AppState.hasMusic) {
        AppState.hasMusic = true;
        btn.textContent = '🎵 Playing';
        btn.style.background = 'linear-gradient(135deg, hsl(340, 82%, 75%), hsl(340, 82%, 85%))';
        btn.style.color = 'white';

        // In a real implementation, you could add an <audio> element
        // with a local music file here
    } else {
        AppState.hasMusic = false;
        btn.textContent = 'Music 🎵';
        btn.style.background = '';
        btn.style.color = '';
    }
}

// ===================================
// RESET APP
// ===================================
function resetApp() {
    // Clear finale interval
    if (window.finaleInterval) {
        clearInterval(window.finaleInterval);
        window.finaleInterval = null;
    }

    // Reset state
    AppState.currentScreen = 'screen-landing';
    AppState.heartsCollected = 0;
    AppState.noClickCount = 0;
    AppState.hasMusic = false;

    // Clear confetti
    const confettiContainer = document.getElementById('confettiContainer');
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
    }

    // Clear interactive area
    const interactiveArea = document.getElementById('interactiveArea');
    if (interactiveArea) {
        interactiveArea.innerHTML = '';
    }

    // Reset music button
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn) {
        musicBtn.textContent = 'Music 🎵';
        musicBtn.style.background = '';
        musicBtn.style.color = '';
    }

    // Go back to landing
    goToScreen('screen-landing');
}
