/**
 * InputHandler Module
 * 
 * Handles keyboard input for player movement.
 * Supports both WASD and arrow keys, as well as touch controls for mobile.
 */

export class InputHandler {
    constructor() {
        // Movement state
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        
        // Bind event handlers
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        
        // Add keyboard event listeners
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        
        // Set up touch controls for mobile
        this.setupTouchControls();
    }
    
    /**
     * Sets up touch controls for mobile devices
     */
    setupTouchControls() {
        // Get touch control elements
        this.upButton = document.getElementById('up-button');
        this.downButton = document.getElementById('down-button');
        this.leftButton = document.getElementById('left-button');
        this.rightButton = document.getElementById('right-button');
        
        // Check if touch elements exist
        if (this.upButton && this.downButton && this.leftButton && this.rightButton) {
            // Add touch event listeners
            this.upButton.addEventListener('touchstart', () => this.onTouchStart('up'), { passive: true });
            this.upButton.addEventListener('touchend', () => this.onTouchEnd('up'), { passive: true });
            
            this.downButton.addEventListener('touchstart', () => this.onTouchStart('down'), { passive: true });
            this.downButton.addEventListener('touchend', () => this.onTouchEnd('down'), { passive: true });
            
            this.leftButton.addEventListener('touchstart', () => this.onTouchStart('left'), { passive: true });
            this.leftButton.addEventListener('touchend', () => this.onTouchEnd('left'), { passive: true });
            
            this.rightButton.addEventListener('touchstart', () => this.onTouchStart('right'), { passive: true });
            this.rightButton.addEventListener('touchend', () => this.onTouchEnd('right'), { passive: true });
        }
    }
    
    /**
     * Handles touch start events
     * @param {string} direction - The direction touched
     */
    onTouchStart(direction) {
        switch (direction) {
            case 'up':
                this.keys.forward = true;
                break;
            case 'down':
                this.keys.backward = true;
                break;
            case 'left':
                this.keys.left = true;
                break;
            case 'right':
                this.keys.right = true;
                break;
        }
    }
    
    /**
     * Handles touch end events
     * @param {string} direction - The direction released
     */
    onTouchEnd(direction) {
        switch (direction) {
            case 'up':
                this.keys.forward = false;
                break;
            case 'down':
                this.keys.backward = false;
                break;
            case 'left':
                this.keys.left = false;
                break;
            case 'right':
                this.keys.right = false;
                break;
        }
    }
    
    /**
     * Handles keydown events
     * @param {KeyboardEvent} event - The keyboard event
     */
    onKeyDown(event) {
        switch (event.key) {
            // WASD keys
            case 'w':
            case 'W':
                this.keys.forward = true;
                break;
            case 's':
            case 'S':
                this.keys.backward = true;
                break;
            case 'a':
            case 'A':
                this.keys.left = true;
                break;
            case 'd':
            case 'D':
                this.keys.right = true;
                break;
                
            // Arrow keys
            case 'ArrowUp':
                this.keys.forward = true;
                break;
            case 'ArrowDown':
                this.keys.backward = true;
                break;
            case 'ArrowLeft':
                this.keys.left = true;
                break;
            case 'ArrowRight':
                this.keys.right = true;
                break;
        }
    }
    
    /**
     * Handles keyup events
     * @param {KeyboardEvent} event - The keyboard event
     */
    onKeyUp(event) {
        switch (event.key) {
            // WASD keys
            case 'w':
            case 'W':
                this.keys.forward = false;
                break;
            case 's':
            case 'S':
                this.keys.backward = false;
                break;
            case 'a':
            case 'A':
                this.keys.left = false;
                break;
            case 'd':
            case 'D':
                this.keys.right = false;
                break;
                
            // Arrow keys
            case 'ArrowUp':
                this.keys.forward = false;
                break;
            case 'ArrowDown':
                this.keys.backward = false;
                break;
            case 'ArrowLeft':
                this.keys.left = false;
                break;
            case 'ArrowRight':
                this.keys.right = false;
                break;
        }
    }
    
    /**
     * Gets the current movement direction based on key states
     * @returns {Object} - Movement vector with x and z components
     */
    getMovement() {
        const movement = { x: 0, z: 0 };
        
        if (this.keys.forward) {
            movement.z = -1;
        }
        
        if (this.keys.backward) {
            movement.z = 1;
        }
        
        if (this.keys.left) {
            movement.x = -1;
        }
        
        if (this.keys.right) {
            movement.x = 1;
        }
        
        // Normalize diagonal movement
        if (movement.x !== 0 && movement.z !== 0) {
            const length = Math.sqrt(movement.x * movement.x + movement.z * movement.z);
            movement.x /= length;
            movement.z /= length;
        }
        
        return movement;
    }
    
    /**
     * Cleans up event listeners
     */
    dispose() {
        // Remove keyboard event listeners
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        
        // Remove touch event listeners if they exist
        if (this.upButton && this.downButton && this.leftButton && this.rightButton) {
            this.upButton.removeEventListener('touchstart', () => this.onTouchStart('up'));
            this.upButton.removeEventListener('touchend', () => this.onTouchEnd('up'));
            
            this.downButton.removeEventListener('touchstart', () => this.onTouchStart('down'));
            this.downButton.removeEventListener('touchend', () => this.onTouchEnd('down'));
            
            this.leftButton.removeEventListener('touchstart', () => this.onTouchStart('left'));
            this.leftButton.removeEventListener('touchend', () => this.onTouchEnd('left'));
            
            this.rightButton.removeEventListener('touchstart', () => this.onTouchStart('right'));
            this.rightButton.removeEventListener('touchend', () => this.onTouchEnd('right'));
        }
    }
} 