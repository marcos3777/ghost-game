/**
 * Ghost Maze Game - Main Entry Point (2D Version)
 * 
 * This file initializes the game and connects all the modules together.
 * It handles the main game loop, level progression, and UI updates.
 * Now optimized for a 2D top-down maze similar to the reference image.
 */

import { GameRenderer } from './modules/renderer.js';
import { MazeGenerator } from './modules/mazeGenerator.js';
import { Ghost } from './modules/ghost.js';
import { Woman } from './modules/woman.js';
import { InputHandler } from './modules/input.js';
import { LightingManager } from './modules/lighting.js';
import { UIManager } from './modules/ui.js';
import { CollisionDetector } from './modules/collision.js';
import { AudioManager } from './modules/audio.js';

class Game {
    constructor() {
        // Update page title to reflect 2D version
        document.title = "2D Ghost Maze Game";
        
        // Add a game title to the UI
        const titleElement = document.createElement('div');
        titleElement.id = 'game-title';
        titleElement.innerText = '2D Ghost Maze';
        titleElement.style.position = 'absolute';
        titleElement.style.top = '10px';
        titleElement.style.left = '50%';
        titleElement.style.transform = 'translateX(-50%)';
        titleElement.style.fontSize = '24px';
        titleElement.style.fontWeight = 'bold';
        titleElement.style.color = '#cccccc'; // Light gray for better contrast on black
        titleElement.style.zIndex = '100';
        titleElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)'; // Add shadow for better visibility
        document.getElementById('game-container').appendChild(titleElement);
        
        // Game state
        this.isRunning = false;
        this.level = 1;
        this.score = 0;
        this.timeRemaining = 60; // seconds
        this.baseTime = 60;
        this.timePenaltyPerLevel = 5; // Reduce time by this amount each level
        
        // Initialize modules
        this.renderer = new GameRenderer();
        this.mazeGenerator = new MazeGenerator();
        this.ghost = new Ghost(this.renderer.scene);
        this.woman = new Woman(this.renderer.scene);
        this.inputHandler = new InputHandler();
        this.lightingManager = new LightingManager(this.renderer.scene);
        this.uiManager = new UIManager();
        this.collisionDetector = new CollisionDetector();
        this.audioManager = new AudioManager();
        
        // Movement settings
        this.movementSpeed = 3.5; // Increased movement speed (was 2.0)
        this.collisionPadding = 0.1; // Collision padding for walls
        
        // Animation frame ID for proper cleanup
        this.animationFrameId = null;
        this.timerInterval = null;
        
        // Game state control
        this.isGameOver = false;
        this.isLevelComplete = false;
        this.isRestarting = false;
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Sets up all event listeners for the game
     */
    setupEventListeners() {
        // Bind methods to this context
        this.update = this.update.bind(this);
        this.startGame = this.startGame.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.levelComplete = this.levelComplete.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.continueToNextLevel = this.continueToNextLevel.bind(this);
        
        // Remove existing listeners if any
        const restartButton = document.getElementById('restart-button');
        const continueButton = document.getElementById('continue-button');
        
        if (restartButton) {
            restartButton.removeEventListener('click', this.restartGame);
            restartButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!this.isRestarting) {
                    this.isRestarting = true;
                    this.restartGame();
                }
            });
        }
        
        if (continueButton) {
            continueButton.removeEventListener('click', this.continueToNextLevel);
            continueButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.continueToNextLevel();
            });
        }
        
        // Hide loading screen when everything is ready
        window.addEventListener('load', () => {
            document.getElementById('loading').style.display = 'none';
            this.startGame();
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.renderer.handleResize();
        });
    }
    
    startGame() {
        // Clear any existing animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Clear any existing timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset game state
        this.isRunning = true;
        this.isGameOver = false;
        this.isLevelComplete = false;
        this.isRestarting = false;
        this.level = 1;
        this.score = 0;
        this.timeRemaining = this.baseTime;
        
        // Generate first maze
        try {
            this.generateLevel();
            
            // Start game loop
            this.lastTime = performance.now();
            this.animationFrameId = requestAnimationFrame(this.update);
            
            // Start timer
            this.timerInterval = setInterval(() => {
                if (this.isRunning) {
                    this.timeRemaining--;
                    this.uiManager.updateTimer(this.timeRemaining);
                    
                    if (this.timeRemaining <= 0) {
                        this.gameOver();
                    }
                }
            }, 1000);
        } catch (error) {
            console.error("Failed to start game:", error);
            
            // Try to recover
            setTimeout(() => {
                this.restartGame();
            }, 1000);
        }
    }
    
    generateLevel() {
        // Calculate maze size based on level
        const baseMazeSize = 10; // Start with a 10x10 maze
        const mazeSize = Math.min(baseMazeSize + Math.floor(this.level / 2), 20); // Increase size with level, max 20
        
        // Generate new maze
        const maze = this.mazeGenerator.generate(mazeSize, mazeSize);
        
        // Clear previous level objects
        this.renderer.clearScene();
        
        // Add maze walls to scene
        this.mazeGenerator.buildMaze(this.renderer.scene, maze);
        
        // Position ghost at start
        const startPosition = this.mazeGenerator.getStartPosition();
        this.ghost.setPosition(startPosition.x, 0.1, startPosition.z);
        this.renderer.scene.add(this.ghost.mesh);
        
        // Position woman at end
        const endPosition = this.mazeGenerator.getEndPosition();
        this.woman.setPosition(endPosition.x, 0.1, endPosition.z);
        this.renderer.scene.add(this.woman.mesh);
        
        // Setup simple lighting for 2D view
        this.lightingManager.setupLights();
        
        // Update UI
        this.uiManager.updateLevel(this.level);
        this.uiManager.updateScore(this.score);
        this.uiManager.updateTimer(this.timeRemaining);
        
        // Set camera to center on ghost
        this.renderer.setCameraTarget(this.ghost.mesh);
    }
    
    update(currentTime) {
        // Continue rendering even when paused
        this.renderer.render();
        
        if (!this.isRunning) {
            this.animationFrameId = requestAnimationFrame(this.update);
            return;
        }
        
        // Calculate delta time
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1); // Cap delta time
        this.lastTime = currentTime;
        
        // Handle input
        const movement = this.inputHandler.getMovement();
        
        // Update ghost position with collision detection
        if (movement.x !== 0 || movement.z !== 0) {
            // Calculate new position with reduced speed
            const newX = this.ghost.mesh.position.x + movement.x * deltaTime * this.movementSpeed;
            const newZ = this.ghost.mesh.position.z + movement.z * deltaTime * this.movementSpeed;
            
            // Try horizontal and vertical movement separately for better wall sliding
            const newPositionX = {
                x: newX,
                z: this.ghost.mesh.position.z
            };
            
            const newPositionZ = {
                x: this.ghost.mesh.position.x,
                z: newZ
            };
            
            // Check for collisions in each direction separately
            const collideX = this.collisionDetector.checkCollision(newPositionX, this.mazeGenerator.getWalls(), this.collisionPadding);
            const collideZ = this.collisionDetector.checkCollision(newPositionZ, this.mazeGenerator.getWalls(), this.collisionPadding);
            
            // Move in non-colliding directions
            if (!collideX) {
                this.ghost.mesh.position.x = newX;
            }
            
            if (!collideZ) {
                this.ghost.mesh.position.z = newZ;
            }
            
            // Update camera to follow ghost
            this.renderer.setCameraTarget(this.ghost.mesh);
        }
        
        // Update animations
        this.ghost.update(deltaTime);
        
        // Check if ghost is near woman
        const distanceToWoman = this.ghost.mesh.position.distanceTo(this.woman.mesh.position);
        if (distanceToWoman < 1.5) {
            this.woman.startBeckoning();
        } else {
            this.woman.stopBeckoning();
        }
        this.woman.update(deltaTime);
        
        // Check if ghost reached woman
        if (distanceToWoman < 0.7 && !this.isLevelComplete) {
            this.levelComplete();
            return;
        }
        
        // Continue game loop
        this.animationFrameId = requestAnimationFrame(this.update);
    }
    
    levelComplete() {
        if (this.isLevelComplete) return;
        
        this.isRunning = false;
        this.isLevelComplete = true;
        
        // Update score
        this.score += this.level * 100 + this.timeRemaining * 10;
        this.uiManager.updateScore(this.score);
        
        // Show level complete screen
        document.getElementById('next-level').textContent = this.level + 1;
        document.getElementById('level-complete').style.display = 'block';
        
        // Play sound at reduced volume
        this.audioManager.playLevelComplete();
    }
    
    continueToNextLevel() {
        if (!this.isLevelComplete) return;
        
        // Hide level complete screen
        document.getElementById('level-complete').style.display = 'none';
        
        // Increase level
        this.level++;
        
        // Reduce time for next level
        this.timeRemaining = Math.max(30, this.baseTime - (this.level - 1) * this.timePenaltyPerLevel);
        
        try {
            // Reset state
            this.isLevelComplete = false;
            
            // Generate new level
            this.generateLevel();
            
            // Resume game
            this.isRunning = true;
            this.lastTime = performance.now();
            
            // Make sure we're not duplicating animation frames
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            this.animationFrameId = requestAnimationFrame(this.update);
        } catch (error) {
            console.error("Error generating next level:", error);
            // Try to recover by restarting the game
            this.restartGame();
        }
    }
    
    gameOver() {
        if (this.isGameOver) return;
        
        this.isRunning = false;
        this.isGameOver = true;
        
        // Clean up timers and animation
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Show game over screen
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').style.display = 'block';
        
        // Play sound
        this.audioManager.playGameOver();
    }
    
    restartGame() {
        if (this.isRestarting) {
            // Prevent multiple restarts
            this.isRestarting = false;
            
            // Hide all UI screens
            document.getElementById('game-over').style.display = 'none';
            document.getElementById('level-complete').style.display = 'none';
            
            // Clean up
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
            
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            // Clean up all references
            this.renderer.clearScene();
            
            // Start new game after a short delay to ensure clean state
            setTimeout(() => {
                this.startGame();
            }, 100);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
}); 