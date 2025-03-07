/**
 * Ghost Module
 * 
 * Handles the ghost character, its appearance, movement, and animations for 2D view.
 * Styled like a Pac-Man ghost but white.
 */

import * as THREE from 'three';

export class Ghost {
    constructor(scene) {
        // Create ghost mesh
        this.createGhostMesh();
        
        // Animation properties
        this.floatSpeed = 2.2; // Increased floating animation speed (was 1.5)
        this.floatHeight = 0.1; // Height of floating animation (reduced for 2D)
        this.floatTime = 0; // Time counter for animation
        
        // Eye animation properties
        this.eyeSpeed = 3.0; // Increased eye movement speed (was 2.0)
        this.eyeTime = 0;
    }
    
    /**
     * Creates the ghost mesh for top-down 2D view based on Pac-Man ghost
     */
    createGhostMesh() {
        // Create ghost group
        this.mesh = new THREE.Group();
        
        // Create Pac-Man style ghost body
        this.createPacManGhostBody();
        
        // Create Pac-Man style eyes
        this.createPacManGhostEyes();
        
        // Add a small point light to make the ghost stand out
        const ghostLight = new THREE.PointLight(0xffffff, 0.5, 3);
        ghostLight.position.set(0, 0.2, 0);
        this.mesh.add(ghostLight);
        
        // Set initial position
        this.mesh.position.set(0, 0.1, 0);
    }
    
    /**
     * Creates the body of the Pac-Man style ghost
     */
    createPacManGhostBody() {
        // Create ghost body shape (classic Pac-Man ghost shape)
        const radius = 0.4;
        const segments = 32;
        
        // Top semi-circle part of ghost
        const bodyTopGeometry = new THREE.CircleGeometry(radius, segments, 0, Math.PI);
        const bodyMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff, // White ghost
            side: THREE.DoubleSide
        });
        
        this.bodyTop = new THREE.Mesh(bodyTopGeometry, bodyMaterial);
        this.bodyTop.rotation.x = -Math.PI / 2; // Make it horizontal for top-down view
        this.bodyTop.position.y = 0.05;
        this.bodyTop.position.z = -radius/2; // Offset to position correctly
        this.mesh.add(this.bodyTop);
        
        // Bottom rectangle part of ghost
        const bodyBottomGeometry = new THREE.PlaneGeometry(radius * 2, radius);
        this.bodyBottom = new THREE.Mesh(bodyBottomGeometry, bodyMaterial);
        this.bodyBottom.rotation.x = -Math.PI / 2; // Make it horizontal for top-down view
        this.bodyBottom.position.y = 0.05;
        this.bodyBottom.position.z = 0; // Center of the ghost
        this.mesh.add(this.bodyBottom);
        
        // Create the wavy bottom (3 triangles)
        const waveWidth = (radius * 2) / 3;
        const waveHeight = radius * 0.4;
        
        for (let i = 0; i < 3; i++) {
            const waveShape = new THREE.Shape();
            const startX = -radius + i * waveWidth;
            
            waveShape.moveTo(startX, 0);
            waveShape.lineTo(startX + waveWidth, 0);
            waveShape.lineTo(startX + waveWidth/2, waveHeight);
            waveShape.lineTo(startX, 0);
            
            const waveGeometry = new THREE.ShapeGeometry(waveShape);
            const wave = new THREE.Mesh(waveGeometry, bodyMaterial);
            wave.rotation.x = -Math.PI / 2;
            wave.position.y = 0.05;
            wave.position.z = radius/2; // Bottom of the ghost
            
            this.mesh.add(wave);
        }
    }
    
    /**
     * Creates the eyes of the Pac-Man style ghost
     */
    createPacManGhostEyes() {
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000088 }); // Blue eyes
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White pupils
        
        // Create left eye
        const leftEyeGeometry = new THREE.CircleGeometry(0.12, 24);
        this.leftEye = new THREE.Mesh(leftEyeGeometry, eyeMaterial);
        this.leftEye.rotation.x = -Math.PI / 2;
        this.leftEye.position.set(-0.15, 0.07, -0.1);
        this.mesh.add(this.leftEye);
        
        // Create right eye
        const rightEyeGeometry = new THREE.CircleGeometry(0.12, 24);
        this.rightEye = new THREE.Mesh(rightEyeGeometry, eyeMaterial);
        this.rightEye.rotation.x = -Math.PI / 2;
        this.rightEye.position.set(0.15, 0.07, -0.1);
        this.mesh.add(this.rightEye);
        
        // Create left pupil
        const leftPupilGeometry = new THREE.CircleGeometry(0.05, 16);
        this.leftPupil = new THREE.Mesh(leftPupilGeometry, pupilMaterial);
        this.leftPupil.rotation.x = -Math.PI / 2;
        this.leftPupil.position.set(-0.15, 0.08, -0.07);
        this.mesh.add(this.leftPupil);
        
        // Create right pupil
        const rightPupilGeometry = new THREE.CircleGeometry(0.05, 16);
        this.rightPupil = new THREE.Mesh(rightPupilGeometry, pupilMaterial);
        this.rightPupil.rotation.x = -Math.PI / 2;
        this.rightPupil.position.set(0.15, 0.08, -0.07);
        this.mesh.add(this.rightPupil);
    }
    
    /**
     * Sets the position of the ghost
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    setPosition(x, y, z) {
        this.mesh.position.set(x, 0.1, z); // Keep Y fixed for 2D
    }
    
    /**
     * Moves the ghost relative to its current position
     * @param {number} x - X movement
     * @param {number} z - Z movement
     */
    move(x, z) {
        this.mesh.position.x += x;
        this.mesh.position.z += z;
        
        // Look in the direction of movement
        if (Math.abs(x) > 0.001 || Math.abs(z) > 0.001) {
            const angle = Math.atan2(z, x);
            // Smooth rotation towards movement direction
            const targetRotation = angle + Math.PI; // Adjust so ghost faces movement direction
            const rotationDiff = targetRotation - this.mesh.rotation.y;
            
            // Normalize the angle difference
            let normRotation = rotationDiff;
            while (normRotation > Math.PI) normRotation -= Math.PI * 2;
            while (normRotation < -Math.PI) normRotation += Math.PI * 2;
            
            // Apply smooth rotation
            this.mesh.rotation.y += normRotation * 0.1;
        }
    }
    
    /**
     * Updates the ghost animation
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update floating animation (subtle for 2D view)
        this.floatTime += deltaTime * this.floatSpeed;
        
        // Apply subtle floating motion (sine wave)
        const floatOffset = Math.sin(this.floatTime) * this.floatHeight;
        this.mesh.position.y = 0.1 + floatOffset;
        
        // Update eye animation
        this.eyeTime += deltaTime * this.eyeSpeed;
        
        // Make the pupils look around (circle motion)
        if (this.leftPupil && this.rightPupil) {
            const eyeRadius = 0.03;
            const eyeX = Math.sin(this.eyeTime * 0.5) * eyeRadius;
            const eyeZ = Math.cos(this.eyeTime * 0.5) * eyeRadius;
            
            this.leftPupil.position.x = -0.15 + eyeX;
            this.leftPupil.position.z = -0.07 + eyeZ;
            
            this.rightPupil.position.x = 0.15 + eyeX;
            this.rightPupil.position.z = -0.07 + eyeZ;
        }
        
        // Subtle pulsing/squashing animation typical of Pac-Man ghosts
        const squashStretch = 1.0 + 0.1 * Math.sin(this.floatTime * 1.5);
        if (this.bodyTop && this.bodyBottom) {
            this.bodyTop.scale.set(squashStretch, 1, 2 - squashStretch);
            this.bodyBottom.scale.set(squashStretch, 1, 1);
        }
    }
} 