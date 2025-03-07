/**
 * CollisionDetector Module
 * 
 * Handles collision detection between the ghost and maze walls in 2D.
 */

export class CollisionDetector {
    constructor() {
        // Ghost collision properties
        this.ghostRadius = 0.3; // Radius of ghost for collision purposes
    }
    
    /**
     * Checks if a position would result in a collision with walls
     * @param {Object} position - Position to check (x, z coordinates)
     * @param {Array} walls - Array of wall objects with start/end positions
     * @param {number} padding - Optional padding to make collisions more forgiving
     * @returns {boolean} - True if collision would occur, false otherwise
     */
    checkCollision(position, walls, padding = 0) {
        const effectiveRadius = this.ghostRadius - padding; // Apply padding
        
        // Check collision with each wall (which is now a line segment)
        for (const wall of walls) {
            // Use line segment to point distance formula
            const distance = this.distanceToLineSegment(
                position.x, position.z,
                wall.x1, wall.z1,
                wall.x2, wall.z2
            );
            
            if (distance < effectiveRadius) {
                return true; // Collision detected
            }
        }
        
        return false; // No collision
    }
    
    /**
     * Calculates the shortest distance from a point to a line segment
     * @param {number} px - Point X coordinate
     * @param {number} pz - Point Z coordinate
     * @param {number} x1 - Line start X coordinate
     * @param {number} z1 - Line start Z coordinate
     * @param {number} x2 - Line end X coordinate
     * @param {number} z2 - Line end Z coordinate
     * @returns {number} - Shortest distance from point to line segment
     */
    distanceToLineSegment(px, pz, x1, z1, x2, z2) {
        // Calculate squared length of line segment
        const lengthSquared = (x2 - x1) * (x2 - x1) + (z2 - z1) * (z2 - z1);
        
        if (lengthSquared === 0) {
            // Line segment is just a point
            return Math.sqrt((px - x1) * (px - x1) + (pz - z1) * (pz - z1));
        }
        
        // Calculate projection of point onto line segment
        const t = Math.max(0, Math.min(1, ((px - x1) * (x2 - x1) + (pz - z1) * (z2 - z1)) / lengthSquared));
        
        // Calculate closest point on line segment
        const closestX = x1 + t * (x2 - x1);
        const closestZ = z1 + t * (z2 - z1);
        
        // Calculate distance from point to closest point on line segment
        return Math.sqrt((px - closestX) * (px - closestX) + (pz - closestZ) * (pz - closestZ));
    }
    
    /**
     * Gets a safe position to place the ghost if colliding
     * @param {Object} currentPosition - Current position
     * @param {Object} desiredPosition - Desired position
     * @param {Array} walls - Array of wall objects
     * @param {number} padding - Optional padding to make collisions more forgiving
     * @returns {Object} - Safe position (may be current if desired is not safe)
     */
    getSafePosition(currentPosition, desiredPosition, walls, padding = 0) {
        // Check if desired position is safe
        if (!this.checkCollision(desiredPosition, walls, padding)) {
            return desiredPosition;
        }
        
        // If not safe, try to slide along the walls
        const safePositionX = { x: desiredPosition.x, z: currentPosition.z };
        const safePositionZ = { x: currentPosition.x, z: desiredPosition.z };
        
        // Try moving only on X axis
        if (!this.checkCollision(safePositionX, walls, padding)) {
            return safePositionX;
        }
        
        // Try moving only on Z axis
        if (!this.checkCollision(safePositionZ, walls, padding)) {
            return safePositionZ;
        }
        
        // If neither works, stay at current position
        return currentPosition;
    }
    
    /**
     * Finds the nearest wall to a position
     * @param {Object} position - Position to check from
     * @param {Array} walls - Array of wall objects
     * @returns {Object} - Nearest wall and distance
     */
    findNearestWall(position, walls) {
        let nearestWall = null;
        let minDistance = Infinity;
        
        for (const wall of walls) {
            const distance = this.distanceToLineSegment(
                position.x, position.z,
                wall.x1, wall.z1,
                wall.x2, wall.z2
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestWall = wall;
            }
        }
        
        return {
            wall: nearestWall,
            distance: minDistance
        };
    }
} 