/**
 * Female Character Module
 * 
 * Handles the female character and her animations in 2D view.
 * Designed to look like a game girl character.
 */

import * as THREE from 'three';

export class Woman {
    constructor(scene) {
        // Create female character mesh for 2D
        this.createGameGirlMesh();
        
        // Animation properties
        this.isWaving = false;
        this.waveSpeed = 3.0;
        this.waveTime = 0;
        
        // Hair animation properties
        this.hairSpeed = 1.2;
        this.hairTime = 0;
    }
    
    /**
     * Creates the female character mesh for top-down 2D view
     */
    createGameGirlMesh() {
        // Create character group
        this.mesh = new THREE.Group();
        
        // Colors
        const skinColor = 0xffccaa;      // Peachy skin tone
        const hairColor = 0xffcc00;      // Blonde hair
        const dressColor = 0xff66cc;     // Pink dress
        const shoeColor = 0xcc3366;      // Pink/red shoes
        
        // Create female character body
        const bodyGeometry = new THREE.CircleGeometry(0.3, 32);
        const bodyMaterial = new THREE.MeshBasicMaterial({
            color: skinColor
        });
        
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        this.body.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        this.body.position.y = 0.05; // Just above the floor
        this.mesh.add(this.body);
        
        // Create hair (longer on the sides and back)
        this.createHair(hairColor);
        
        // Create dress
        this.createDress(dressColor);
        
        // Create face features
        this.createFace(skinColor);
        
        // Create arms
        this.createArms(skinColor);
        
        // Add a small point light to make the character stand out
        const characterLight = new THREE.PointLight(0xffffaa, 0.6, 3);
        characterLight.position.set(0, 0.3, 0);
        this.mesh.add(characterLight);
        
        // Set initial position
        this.mesh.position.set(0, 0.1, 0);
    }
    
    /**
     * Creates the character's hair
     * @param {number} hairColor - Color of the hair
     */
    createHair(hairColor) {
        const hairMaterial = new THREE.MeshBasicMaterial({
            color: hairColor,
            side: THREE.DoubleSide
        });
        
        // Main hair - larger circle behind the head
        const hairBackGeometry = new THREE.CircleGeometry(0.4, 32);
        this.hairBack = new THREE.Mesh(hairBackGeometry, hairMaterial);
        this.hairBack.rotation.x = -Math.PI / 2;
        this.hairBack.position.set(0, 0.045, 0.05); // Slightly below body and behind
        this.mesh.add(this.hairBack);
        
        // Front hair/bangs
        const bangsGeometry = new THREE.PlaneGeometry(0.35, 0.15);
        this.bangs = new THREE.Mesh(bangsGeometry, hairMaterial);
        this.bangs.rotation.x = -Math.PI / 2;
        this.bangs.position.set(0, 0.051, -0.2); // Front of face
        this.mesh.add(this.bangs);
        
        // Side hair (left)
        const leftHairGeometry = new THREE.PlaneGeometry(0.15, 0.3);
        this.leftHair = new THREE.Mesh(leftHairGeometry, hairMaterial);
        this.leftHair.rotation.x = -Math.PI / 2;
        this.leftHair.position.set(-0.25, 0.048, 0); // Left side
        this.mesh.add(this.leftHair);
        
        // Side hair (right)
        const rightHairGeometry = new THREE.PlaneGeometry(0.15, 0.3);
        this.rightHair = new THREE.Mesh(rightHairGeometry, hairMaterial);
        this.rightHair.rotation.x = -Math.PI / 2;
        this.rightHair.position.set(0.25, 0.048, 0); // Right side
        this.mesh.add(this.rightHair);
    }
    
    /**
     * Creates the character's dress
     * @param {number} dressColor - Color of the dress
     */
    createDress(dressColor) {
        const dressMaterial = new THREE.MeshBasicMaterial({
            color: dressColor,
            side: THREE.DoubleSide
        });
        
        // A-line dress shape
        const dressGeometry = new THREE.CircleGeometry(0.5, 32);
        this.dress = new THREE.Mesh(dressGeometry, dressMaterial);
        this.dress.rotation.x = -Math.PI / 2;
        this.dress.position.set(0, 0.04, 0.1); // Below body, centered and shifted back
        this.mesh.add(this.dress);
    }
    
    /**
     * Creates the character's face features
     * @param {number} skinColor - Color of the skin
     */
    createFace(skinColor) {
        // Eyes
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x3366cc }); // Blue eyes
        
        // Left eye
        const leftEyeGeometry = new THREE.CircleGeometry(0.04, 16);
        this.leftEye = new THREE.Mesh(leftEyeGeometry, eyeMaterial);
        this.leftEye.rotation.x = -Math.PI / 2;
        this.leftEye.position.set(-0.08, 0.06, -0.12);
        this.mesh.add(this.leftEye);
        
        // Right eye
        const rightEyeGeometry = new THREE.CircleGeometry(0.04, 16);
        this.rightEye = new THREE.Mesh(rightEyeGeometry, eyeMaterial);
        this.rightEye.rotation.x = -Math.PI / 2;
        this.rightEye.position.set(0.08, 0.06, -0.12);
        this.mesh.add(this.rightEye);
        
        // Mouth (smile)
        const mouthGeometry = new THREE.PlaneGeometry(0.12, 0.03);
        const mouthMaterial = new THREE.MeshBasicMaterial({ color: 0xff3366 });
        this.mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
        this.mouth.rotation.x = -Math.PI / 2;
        this.mouth.position.set(0, 0.06, -0.05);
        this.mesh.add(this.mouth);
        
        // Blush spots on cheeks
        const blushMaterial = new THREE.MeshBasicMaterial({ color: 0xff9999 });
        
        // Left blush
        const leftBlushGeometry = new THREE.CircleGeometry(0.05, 16);
        this.leftBlush = new THREE.Mesh(leftBlushGeometry, blushMaterial);
        this.leftBlush.rotation.x = -Math.PI / 2;
        this.leftBlush.position.set(-0.15, 0.055, -0.08);
        this.mesh.add(this.leftBlush);
        
        // Right blush
        const rightBlushGeometry = new THREE.CircleGeometry(0.05, 16);
        this.rightBlush = new THREE.Mesh(rightBlushGeometry, blushMaterial);
        this.rightBlush.rotation.x = -Math.PI / 2;
        this.rightBlush.position.set(0.15, 0.055, -0.08);
        this.mesh.add(this.rightBlush);
    }
    
    /**
     * Creates the character's arms
     * @param {number} skinColor - Color of the skin
     */
    createArms(skinColor) {
        const armMaterial = new THREE.MeshBasicMaterial({
            color: skinColor,
            side: THREE.DoubleSide
        });
        
        // Right arm (will be animated)
        const armGeometry = new THREE.PlaneGeometry(0.1, 0.3);
        this.arm = new THREE.Mesh(armGeometry, armMaterial);
        this.arm.rotation.x = -Math.PI / 2;
        
        // Position arm on the right side of body
        // Use arm pivot for waving animation
        this.armPivot = new THREE.Object3D();
        this.armPivot.position.set(0.25, 0.06, 0);
        this.mesh.add(this.armPivot);
        
        // Place arm with offset to pivot around shoulder
        this.arm.position.set(0.15, 0, 0);
        this.armPivot.add(this.arm);
    }
    
    /**
     * Sets the position of the character
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} z - Z position
     */
    setPosition(x, y, z) {
        this.mesh.position.set(x, 0.1, z); // Keep Y fixed for 2D
    }
    
    /**
     * Starts the waving animation
     */
    startBeckoning() {
        this.isWaving = true;
    }
    
    /**
     * Stops the waving animation
     */
    stopBeckoning() {
        this.isWaving = false;
    }
    
    /**
     * Updates the character animation
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update waving animation
        if (this.isWaving && this.armPivot) {
            this.waveTime += deltaTime * this.waveSpeed;
            
            // Wave the arm back and forth
            const waveAngle = Math.sin(this.waveTime) * 0.8;
            this.armPivot.rotation.z = waveAngle;
        } else if (this.armPivot) {
            // Gradually return arm to rest position
            this.armPivot.rotation.z *= 0.9;
        }
        
        // Animate hair to give a floaty look
        this.hairTime += deltaTime * this.hairSpeed;
        
        if (this.leftHair && this.rightHair) {
            // Sway hair gently
            const hairSway = Math.sin(this.hairTime) * 0.05;
            this.leftHair.position.x = -0.25 + hairSway;
            this.rightHair.position.x = 0.25 - hairSway;
        }
        
        // Make the dress "flow" slightly
        if (this.dress) {
            const dressScale = 1.0 + 0.03 * Math.sin(this.hairTime * 0.8);
            this.dress.scale.set(dressScale, 1, dressScale);
        }
        
        // Blink eyes occasionally
        if (this.leftEye && this.rightEye) {
            // Blink every ~4 seconds
            const shouldBlink = Math.sin(this.hairTime * 0.5) > 0.95;
            if (shouldBlink) {
                this.leftEye.scale.set(1, 1, 0.1);
                this.rightEye.scale.set(1, 1, 0.1);
            } else {
                this.leftEye.scale.set(1, 1, 1);
                this.rightEye.scale.set(1, 1, 1);
            }
        }
    }
} 