/**
 * LightingManager Module
 * 
 * Handles basic lighting for 2D maze game.
 */

import * as THREE from 'three';

export class LightingManager {
    constructor(scene) {
        this.scene = scene;
    }
    
    /**
     * Sets up basic lighting for 2D view
     */
    setupLights() {
        // Clear any existing lights
        this.clearLights();
        
        // Add ambient light (bright for 2D visibility)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);
        
        // Add directional light for subtle shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 10, 0);
        directionalLight.lookAt(0, 0, 0);
        this.scene.add(directionalLight);
    }
    
    /**
     * Clears existing lights from the scene
     */
    clearLights() {
        // Find all lights in the scene
        const lightsToRemove = [];
        
        this.scene.traverse((object) => {
            if (object instanceof THREE.Light && 
                !(object.parent instanceof THREE.Group)) { // Don't remove lights attached to objects
                lightsToRemove.push(object);
            }
        });
        
        // Remove all found lights
        lightsToRemove.forEach(light => {
            this.scene.remove(light);
        });
    }
    
    /**
     * Updates lighting effects (not needed for simple 2D lighting)
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // No dynamic lighting updates needed for simple 2D view
    }
} 