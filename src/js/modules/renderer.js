/**
 * GameRenderer Module
 * 
 * Handles the 2D rendering setup, scene management, and camera.
 */

import * as THREE from 'three';

export class GameRenderer {
    constructor() {
        // Create scene (with black background for 2D maze)
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Calculate aspect ratio and size
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 20; // Controls how much of the world is visible
        
        // Create orthographic camera (for 2D view)
        this.camera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2,  // left
            frustumSize * aspect / 2,   // right
            frustumSize / 2,            // top
            frustumSize / -2,           // bottom
            0.1,                        // near
            1000                        // far
        );
        
        // Set camera position looking directly down (top-down 2D view)
        this.camera.position.set(0, 10, 0);
        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.z = 0; // Ensure maze is aligned with screen
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // No shadows needed for 2D
        this.renderer.shadowMap.enabled = false;
        
        // Add renderer to DOM
        document.getElementById('game-container').appendChild(this.renderer.domElement);
        
        // Camera settings
        this.cameraTarget = null;
        
        // Store the frustum size for later use
        this.frustumSize = frustumSize;
    }
    
    /**
     * Handles window resize events
     */
    handleResize() {
        const aspect = window.innerWidth / window.innerHeight;
        
        // Update orthographic camera on resize
        this.camera.left = this.frustumSize * aspect / -2;
        this.camera.right = this.frustumSize * aspect / 2;
        this.camera.top = this.frustumSize / 2;
        this.camera.bottom = this.frustumSize / -2;
        
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    /**
     * Sets the target for the camera to follow
     * @param {THREE.Object3D} target - The object to center on (usually the ghost)
     */
    setCameraTarget(target) {
        this.cameraTarget = target;
        // Center camera on ghost
        this.camera.position.set(target.position.x, 10, target.position.z);
    }
    
    /**
     * Updates camera position to follow target
     */
    updateCamera() {
        if (!this.cameraTarget) return;
        
        // Smoothly follow the ghost in 2D
        this.camera.position.x = this.cameraTarget.position.x;
        this.camera.position.z = this.cameraTarget.position.z;
    }
    
    /**
     * Clears all objects from the scene
     */
    clearScene() {
        // Remove all meshes but keep lights and camera
        const objectsToRemove = [];
        
        this.scene.traverse((object) => {
            // Keep lights
            if (object instanceof THREE.Light) return;
            // Keep the camera
            if (object instanceof THREE.Camera) return;
            
            // Add everything else to removal list
            if (object !== this.scene) {
                objectsToRemove.push(object);
            }
        });
        
        // Remove all objects in the list
        objectsToRemove.forEach(object => {
            this.scene.remove(object);
        });
    }
    
    /**
     * Renders the scene
     */
    render() {
        this.updateCamera();
        this.renderer.render(this.scene, this.camera);
    }
} 