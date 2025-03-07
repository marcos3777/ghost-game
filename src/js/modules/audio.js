/**
 * AudioManager Module
 * 
 * Handles all game audio including background music, sound effects,
 * and ambient sounds.
 */

export class AudioManager {
    constructor() {
        // Audio setup
        this.audioContext = null;
        this.sounds = {};
        this.music = null;
        this.ambientSound = null;
        
        // Volume settings
        this.masterVolume = 0.4;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.5;
        
        // Initialize audio (must be called after user interaction)
        this.initialized = false;
    }
    
    /**
     * Initializes the audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;
        
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Load sounds
            this.loadSounds();
            
            this.initialized = true;
        } catch (error) {
            console.error('Audio initialization failed:', error);
        }
    }
    
    /**
     * Loads all game sounds
     */
    loadSounds() {
        // Define sounds to load
        const soundsToLoad = {
            ghostMove: '/assets/sounds/ghost_move.mp3',
            wallCollision: '/assets/sounds/wall_collision.mp3',
            levelComplete: '/assets/sounds/level_complete.mp3',
            gameOver: '/assets/sounds/game_over.mp3',
            womanBeckoning: '/assets/sounds/woman_beckoning.mp3',
            ambientCreepy: '/assets/sounds/ambient_creepy.mp3',
            musicBackground: '/assets/sounds/background_music.mp3'
        };
        
        // Instead of actually loading files (which don't exist yet),
        // we'll create oscillator-based sounds for now
        
        // Create an oscillator-based sound
        const createOscillatorSound = (options) => {
            return {
                play: () => {
                    if (!this.audioContext) return;
                    
                    // Create oscillator
                    const oscillator = this.audioContext.createOscillator();
                    oscillator.type = options.type || 'sine';
                    oscillator.frequency.setValueAtTime(options.frequency, this.audioContext.currentTime);
                    
                    // Create gain node for volume
                    const gainNode = this.audioContext.createGain();
                    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gainNode.gain.linearRampToValueAtTime(options.volume * this.sfxVolume * this.masterVolume, this.audioContext.currentTime + 0.01);
                    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + options.duration);
                    
                    // Connect and start
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    oscillator.start();
                    oscillator.stop(this.audioContext.currentTime + options.duration);
                }
            };
        };
        
        // Create placeholder sounds with reduced volumes
        this.sounds = {
            ghostMove: createOscillatorSound({ frequency: 200, type: 'sine', volume: 0.1, duration: 0.2 }),
            wallCollision: createOscillatorSound({ frequency: 100, type: 'sawtooth', volume: 0.2, duration: 0.3 }),
            levelComplete: createOscillatorSound({ frequency: 440, type: 'square', volume: 0.2, duration: 0.8 }),
            gameOver: createOscillatorSound({ frequency: 150, type: 'sawtooth', volume: 0.3, duration: 1.5 }),
            womanBeckoning: createOscillatorSound({ frequency: 600, type: 'sine', volume: 0.15, duration: 0.5 })
        };
    }
    
    /**
     * Plays a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    playSound(soundName) {
        // Initialize audio if not already done
        if (!this.initialized) {
            this.init();
        }
        
        // Play the requested sound
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }
    
    /**
     * Plays the ghost movement sound
     */
    playGhostMove() {
        this.playSound('ghostMove');
    }
    
    /**
     * Plays the wall collision sound
     */
    playWallCollision() {
        this.playSound('wallCollision');
    }
    
    /**
     * Plays the level complete sound
     */
    playLevelComplete() {
        this.playSound('levelComplete');
    }
    
    /**
     * Plays the game over sound
     */
    playGameOver() {
        this.playSound('gameOver');
    }
    
    /**
     * Plays the woman beckoning sound
     */
    playWomanBeckoning() {
        this.playSound('womanBeckoning');
    }
    
    /**
     * Sets the master volume
     * @param {number} volume - Volume level (0-1)
     */
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Sets the music volume
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        // Apply to music if playing
        if (this.music) {
            this.music.volume = this.musicVolume * this.masterVolume;
        }
    }
    
    /**
     * Sets the sound effects volume
     * @param {number} volume - Volume level (0-1)
     */
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
} 