/**
 * UIManager Module
 * 
 * Handles the game's user interface, including timer, score, and level displays.
 * Also manages the game over and level complete screens.
 */

export class UIManager {
    constructor() {
        // Get UI elements
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.finalScoreElement = document.getElementById('final-score');
        this.nextLevelElement = document.getElementById('next-level');
        this.gameOverScreen = document.getElementById('game-over');
        this.levelCompleteScreen = document.getElementById('level-complete');
        this.loadingScreen = document.getElementById('loading');
        this.instructionsElement = document.getElementById('instructions');
    }
    
    /**
     * Updates the timer display
     * @param {number} seconds - Remaining time in seconds
     */
    updateTimer(seconds) {
        if (!this.timerElement) return;
        
        // Format the time
        const formattedTime = Math.max(0, Math.floor(seconds));
        
        // Update timer element
        this.timerElement.textContent = `Time: ${formattedTime}`;
        
        // Add urgency visual when time is running low
        if (formattedTime <= 10) {
            this.timerElement.style.color = '#ff3333';
            this.timerElement.style.fontWeight = 'bold';
            
            // Add pulsing animation if very low on time
            if (formattedTime <= 5) {
                this.timerElement.style.animation = 'pulse 0.5s infinite';
            } else {
                this.timerElement.style.animation = '';
            }
        } else {
            this.timerElement.style.color = '';
            this.timerElement.style.fontWeight = '';
            this.timerElement.style.animation = '';
        }
    }
    
    /**
     * Updates the score display
     * @param {number} score - Current player score
     */
    updateScore(score) {
        if (!this.scoreElement) return;
        
        // Format the score
        const formattedScore = Math.floor(score);
        
        // Update score element
        this.scoreElement.textContent = `Score: ${formattedScore}`;
        
        // Also update the final score display
        if (this.finalScoreElement) {
            this.finalScoreElement.textContent = formattedScore;
        }
    }
    
    /**
     * Updates the level display
     * @param {number} level - Current game level
     */
    updateLevel(level) {
        if (!this.levelElement) return;
        
        // Update level element
        this.levelElement.textContent = `Level: ${level}`;
        
        // Also update the next level display
        if (this.nextLevelElement) {
            this.nextLevelElement.textContent = level + 1;
        }
    }
    
    /**
     * Shows the game over screen
     */
    showGameOver() {
        if (!this.gameOverScreen) return;
        
        this.gameOverScreen.style.display = 'block';
    }
    
    /**
     * Hides the game over screen
     */
    hideGameOver() {
        if (!this.gameOverScreen) return;
        
        this.gameOverScreen.style.display = 'none';
    }
    
    /**
     * Shows the level complete screen
     */
    showLevelComplete() {
        if (!this.levelCompleteScreen) return;
        
        this.levelCompleteScreen.style.display = 'block';
    }
    
    /**
     * Hides the level complete screen
     */
    hideLevelComplete() {
        if (!this.levelCompleteScreen) return;
        
        this.levelCompleteScreen.style.display = 'none';
    }
    
    /**
     * Shows the loading screen
     */
    showLoading() {
        if (!this.loadingScreen) return;
        
        this.loadingScreen.style.display = 'block';
    }
    
    /**
     * Hides the loading screen
     */
    hideLoading() {
        if (!this.loadingScreen) return;
        
        this.loadingScreen.style.display = 'none';
    }
    
    /**
     * Shows instructions
     */
    showInstructions() {
        if (!this.instructionsElement) return;
        
        this.instructionsElement.style.display = 'block';
    }
    
    /**
     * Hides instructions
     */
    hideInstructions() {
        if (!this.instructionsElement) return;
        
        this.instructionsElement.style.display = 'none';
    }
    
    /**
     * Adds a CSS class for screen shake effect (used during dimming)
     */
    screenShake() {
        document.body.classList.add('screen-shake');
        
        // Remove class after the animation
        setTimeout(() => {
            document.body.classList.remove('screen-shake');
        }, 500);
    }
    
    /**
     * Adds a CSS class for flash effect (used when finding the woman)
     */
    flashScreen() {
        document.body.classList.add('screen-flash');
        
        // Remove class after the animation
        setTimeout(() => {
            document.body.classList.remove('screen-flash');
        }, 300);
    }
} 