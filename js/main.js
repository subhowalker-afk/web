/* =====================================================
   Valentine Website — Shared JavaScript
   Handles hearts, navigation, and interactions
   ===================================================== */

// ----- Floating Hearts Generator -----
function createFloatingHearts() {
    const container = document.querySelector('.hearts-bg');
    if (!container) return;

    const heartEmojis = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '🩷'];
    const heartCount = window.innerWidth < 768 ? 12 : 20;

    for (let i = 0; i < heartCount; i++) {
        createHeart(container, heartEmojis, i);
    }
}

function createHeart(container, emojis, index) {
    const heart = document.createElement('span');
    heart.className = 'heart';
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random positioning and timing
    const left = Math.random() * 100;
    const duration = 20 + Math.random() * 25; // 20-45 seconds (slower, dreamier)
    const delay = Math.random() * 15; // 0-15 seconds delay
    const size = 1 + Math.random() * 1.5; // 1-2.5rem scale

    // Apply styles
    heart.style.left = `${left}%`;
    heart.style.fontSize = `${size}rem`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;

    // Random blur style
    const styles = ['', 'heart--blur', 'heart--glow'];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    if (randomStyle) heart.classList.add(randomStyle);

    container.appendChild(heart);
}

// ----- Smooth Page Transitions -----
function navigateTo(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';

    setTimeout(() => {
        window.location.href = url;
    }, 400);
}

// Fade in on page load
function initPageTransition() {
    document.body.style.opacity = '0';

    window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    });
}

// ----- Modal Helpers -----
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// ----- Sparkle Effect -----
function createSparkles(container, count = 10) {
    for (let i = 0; i < count; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(sparkle);
    }
}

// ----- NO Button Logic for Proposal Page -----
class NoButtonManager {
    constructor(noButton, yesButton) {
        this.noButton = noButton;
        this.yesButton = yesButton;
        this.clickCount = 0;
        this.messages = [
            "Are you sure? 🥺",
            "Please? 💕",
            "Pretty please? 🌸",
            "I won't give up! 💖",
            "One more chance? 🦋",
            "You're breaking my heart... just kidding! 💝"
        ];
    }

    handleClick() {
        this.clickCount++;

        if (this.clickCount <= 2) {
            return { type: 'popup', message: this.messages[this.clickCount - 1] };
        } else if (this.clickCount <= 4) {
            this.shrinkButton();
            return { type: 'popup', message: this.messages[Math.min(this.clickCount - 1, this.messages.length - 1)] };
        } else if (this.clickCount <= 6) {
            this.moveButton();
            return { type: 'popup', message: this.messages[Math.min(this.clickCount - 1, this.messages.length - 1)] };
        } else {
            this.hideNoButton();
            this.enlargeYesButton();
            return { type: 'hide' };
        }
    }

    shrinkButton() {
        const currentScale = parseFloat(this.noButton.dataset.scale || 1);
        const newScale = Math.max(0.6, currentScale - 0.15);
        this.noButton.dataset.scale = newScale;
        this.noButton.style.transform = `scale(${newScale})`;
    }

    moveButton() {
        const rect = this.noButton.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 20;
        const maxY = window.innerHeight - rect.height - 20;

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        this.noButton.style.position = 'fixed';
        this.noButton.style.left = `${randomX}px`;
        this.noButton.style.top = `${randomY}px`;
        this.noButton.style.transition = 'all 0.3s ease';
    }

    hideNoButton() {
        this.noButton.style.opacity = '0';
        this.noButton.style.pointerEvents = 'none';
        setTimeout(() => {
            this.noButton.style.display = 'none';
        }, 300);
    }

    enlargeYesButton() {
        this.yesButton.style.transform = 'scale(1.2)';
        this.yesButton.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.6)';
    }
}

// ----- Game Progress Helper -----
class HeartProgressManager {
    constructor(heartElement, maxProgress = 100) {
        this.heart = heartElement;
        this.maxProgress = maxProgress;
        this.currentProgress = 0;
    }

    updateProgress(amount) {
        this.currentProgress = Math.min(this.currentProgress + amount, this.maxProgress);
        const percentage = (this.currentProgress / this.maxProgress) * 100;

        if (this.heart) {
            this.heart.style.setProperty('--fill-percentage', `${percentage}%`);
        }

        return this.currentProgress >= this.maxProgress;
    }

    isComplete() {
        return this.currentProgress >= this.maxProgress;
    }
}

// ----- Initialize on DOM Ready -----
document.addEventListener('DOMContentLoaded', () => {
    initPageTransition();
    createFloatingHearts();
});

// Expose utilities globally
window.valentineUtils = {
    navigateTo,
    showModal,
    hideModal,
    createSparkles,
    NoButtonManager,
    HeartProgressManager
};
