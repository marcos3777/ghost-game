/**
 * MazeGenerator Module
 * 
 * Handles procedural 2D maze generation using a recursive backtracking algorithm.
 * Creates maze with walls as gray lines on black background.
 */

import * as THREE from 'three';

export class MazeGenerator {
    constructor() {
        // 2D maze materials
        this.wallMaterial = new THREE.LineBasicMaterial({ 
            color: 0x999999, // Gray walls
            linewidth: 2
        });
        
        this.pathMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000, // Black floor
            side: THREE.DoubleSide
        });
        
        this.walls = []; // Store wall objects for collision detection
        this.startPosition = { x: 0, z: 0 };
        this.endPosition = { x: 0, z: 0 };
        
        // Cell size for the 2D maze
        this.cellSize = 1.0;
        this.wallThickness = 0.1;
    }
    
    /**
     * Generates a random maze using recursive backtracking algorithm
     * @param {number} width - Width of the maze
     * @param {number} height - Height of the maze
     * @returns {Object} - Maze data structure
     */
    generate(width, height) {
        // Initialize grid (represents cells, not walls)
        const grid = Array(height).fill().map(() => Array(width).fill(0));
        
        // Each cell has 4 walls: top, right, bottom, left
        // 0 = wall present, 1 = wall removed (passage)
        const walls = Array(height).fill().map(() => 
            Array(width).fill().map(() => ({ top: 0, right: 0, bottom: 0, left: 0 }))
        );
        
        // Set starting position (top-left)
        const startX = 0;
        const startY = 0;
        grid[startY][startX] = 1; // Visited
        
        // Store start position
        this.startPosition = {
            x: startX * this.cellSize - (width * this.cellSize) / 2 + this.cellSize / 2,
            z: startY * this.cellSize - (height * this.cellSize) / 2 + this.cellSize / 2
        };
        
        // Carve the maze using recursive backtracking
        this.recursiveBacktracking(grid, walls, startX, startY, width, height);
        
        // Set end position (bottom-right)
        const endX = width - 1;
        const endY = height - 1;
        
        // Make sure there's a path to the end
        this.ensurePathToEnd(grid, walls, endX, endY, width, height);
        
        // Store end position
        this.endPosition = {
            x: endX * this.cellSize - (width * this.cellSize) / 2 + this.cellSize / 2,
            z: endY * this.cellSize - (height * this.cellSize) / 2 + this.cellSize / 2
        };
        
        return { grid, walls };
    }
    
    /**
     * Ensures there's a path to the end position
     * @param {Array} grid - The maze grid
     * @param {Array} walls - The maze walls
     * @param {number} endX - End X position
     * @param {number} endY - End Y position
     * @param {number} width - Maze width
     * @param {number} height - Maze height
     */
    ensurePathToEnd(grid, walls, endX, endY, width, height) {
        // Mark end as visited
        grid[endY][endX] = 1;
        
        // If not already connected, connect to a neighbor
        if (endX > 0 && grid[endY][endX-1] === 1) {
            // Connect to left
            walls[endY][endX].left = 1;
            walls[endY][endX-1].right = 1;
        } else if (endY > 0 && grid[endY-1][endX] === 1) {
            // Connect to top
            walls[endY][endX].top = 1;
            walls[endY-1][endX].bottom = 1;
        } else if (endX < width - 1 && grid[endY][endX+1] === 1) {
            // Connect to right
            walls[endY][endX].right = 1;
            walls[endY][endX+1].left = 1;
        } else if (endY < height - 1 && grid[endY+1][endX] === 1) {
            // Connect to bottom
            walls[endY][endX].bottom = 1;
            walls[endY+1][endX].top = 1;
        } else {
            // Force connection to the nearest visited cell
            let connected = false;
            
            // Spiral search to find nearest visited cell
            for (let dist = 1; dist < width + height && !connected; dist++) {
                for (let dx = -dist; dx <= dist && !connected; dx++) {
                    for (let dy = -dist; dy <= dist && !connected; dy++) {
                        // Only check cells on the square perimeter at distance 'dist'
                        if (Math.abs(dx) !== dist && Math.abs(dy) !== dist) continue;
                        
                        const nx = endX + dx;
                        const ny = endY + dy;
                        
                        // Check if valid cell and visited
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny][nx] === 1) {
                            // Found a visited cell, now connect to it
                            this.connectCells(grid, walls, endX, endY, nx, ny, width, height);
                            connected = true;
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Connects two cells by removing walls between them
     * @param {Array} grid - The maze grid
     * @param {Array} walls - The maze walls
     * @param {number} x1 - First cell X position
     * @param {number} y1 - First cell Y position
     * @param {number} x2 - Second cell X position
     * @param {number} y2 - Second cell Y position
     * @param {number} width - Maze width
     * @param {number} height - Maze height
     */
    connectCells(grid, walls, x1, y1, x2, y2, width, height) {
        // Find a path from (x1,y1) to (x2,y2) and remove walls along the way
        const visited = Array(height).fill().map(() => Array(width).fill(false));
        const queue = [{ x: x1, y: y1, path: [] }];
        visited[y1][x1] = true;
        
        while (queue.length > 0) {
            const { x, y, path } = queue.shift();
            
            // If we reached the target
            if (x === x2 && y === y2) {
                // Remove walls along the path
                let cx = x1, cy = y1;
                for (const dir of path) {
                    if (dir === 'top') {
                        walls[cy][cx].top = 1;
                        walls[cy-1][cx].bottom = 1;
                        cy--;
                    } else if (dir === 'right') {
                        walls[cy][cx].right = 1;
                        walls[cy][cx+1].left = 1;
                        cx++;
                    } else if (dir === 'bottom') {
                        walls[cy][cx].bottom = 1;
                        walls[cy+1][cx].top = 1;
                        cy++;
                    } else if (dir === 'left') {
                        walls[cy][cx].left = 1;
                        walls[cy][cx-1].right = 1;
                        cx--;
                    }
                }
                return;
            }
            
            // Try each direction
            const directions = [
                { dx: 0, dy: -1, dir: 'top' },
                { dx: 1, dy: 0, dir: 'right' },
                { dx: 0, dy: 1, dir: 'bottom' },
                { dx: -1, dy: 0, dir: 'left' }
            ];
            
            for (const { dx, dy, dir } of directions) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
                    visited[ny][nx] = true;
                    queue.push({ x: nx, y: ny, path: [...path, dir] });
                }
            }
        }
    }
    
    /**
     * Recursive backtracking algorithm for maze generation
     * @param {Array} grid - The maze grid
     * @param {Array} walls - The maze walls
     * @param {number} x - Current X position
     * @param {number} y - Current Y position
     * @param {number} width - Maze width
     * @param {number} height - Maze height
     */
    recursiveBacktracking(grid, walls, x, y, width, height) {
        // Define possible directions (in 2D: up, right, down, left)
        const directions = [
            { dx: 0, dy: -1, fromWall: 'top', toWall: 'bottom' },
            { dx: 1, dy: 0, fromWall: 'right', toWall: 'left' },
            { dx: 0, dy: 1, fromWall: 'bottom', toWall: 'top' },
            { dx: -1, dy: 0, fromWall: 'left', toWall: 'right' }
        ];
        
        // Shuffle directions for randomness
        this.shuffleArray(directions);
        
        // Try each direction
        for (const { dx, dy, fromWall, toWall } of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            // Check if the new position is valid and unvisited
            if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny][nx] === 0) {
                // Mark as visited
                grid[ny][nx] = 1;
                
                // Remove walls between current cell and neighbor
                walls[y][x][fromWall] = 1; // Remove wall from current cell
                walls[ny][nx][toWall] = 1; // Remove wall from neighbor cell
                
                // Continue recursively
                this.recursiveBacktracking(grid, walls, nx, ny, width, height);
            }
        }
    }
    
    /**
     * Builds the maze in the Three.js scene
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {Object} mazeData - The maze data structure
     */
    buildMaze(scene, mazeData) {
        const { grid, walls } = mazeData;
        const height = grid.length;
        const width = grid[0].length;
        
        // Clear previous walls
        this.walls = [];
        
        // Calculate maze bounds for centering
        const mazeWidth = width * this.cellSize;
        const mazeHeight = height * this.cellSize;
        const offsetX = -mazeWidth / 2;
        const offsetZ = -mazeHeight / 2;
        
        // Create floor plane (black background)
        const floorGeometry = new THREE.PlaneGeometry(mazeWidth + 1, mazeHeight + 1);
        const floor = new THREE.Mesh(floorGeometry, this.pathMaterial);
        floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        floor.position.set(0, -0.01, 0); // Slightly below walls
        scene.add(floor);
        
        // Draw the outer walls
        this.drawOuterWalls(scene, width, height, offsetX, offsetZ);
        
        // Draw inner walls
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cellWalls = walls[y][x];
                const cellX = offsetX + x * this.cellSize;
                const cellZ = offsetZ + y * this.cellSize;
                
                // Only draw walls that are present (0 = wall exists)
                // Top wall
                if (cellWalls.top === 0) {
                    this.drawWall(scene, 
                        cellX, cellZ, 
                        cellX + this.cellSize, cellZ);
                }
                
                // Right wall
                if (cellWalls.right === 0) {
                    this.drawWall(scene, 
                        cellX + this.cellSize, cellZ, 
                        cellX + this.cellSize, cellZ + this.cellSize);
                }
                
                // Bottom wall
                if (cellWalls.bottom === 0) {
                    this.drawWall(scene, 
                        cellX, cellZ + this.cellSize, 
                        cellX + this.cellSize, cellZ + this.cellSize);
                }
                
                // Left wall
                if (cellWalls.left === 0) {
                    this.drawWall(scene, 
                        cellX, cellZ, 
                        cellX, cellZ + this.cellSize);
                }
            }
        }
    }
    
    /**
     * Draws a single wall as a line
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {number} x1 - Start X position
     * @param {number} z1 - Start Z position
     * @param {number} x2 - End X position
     * @param {number} z2 - End Z position
     */
    drawWall(scene, x1, z1, x2, z2) {
        const points = [
            new THREE.Vector3(x1, 0, z1),
            new THREE.Vector3(x2, 0, z2)
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, this.wallMaterial);
        scene.add(line);
        
        // Add to collision walls
        const midX = (x1 + x2) / 2;
        const midZ = (z1 + z2) / 2;
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
        const angle = Math.atan2(z2 - z1, x2 - x1);
        
        this.walls.push({
            x: midX,
            z: midZ,
            length: length,
            angle: angle,
            x1: x1,
            z1: z1,
            x2: x2,
            z2: z2,
            isHorizontal: Math.abs(z1 - z2) < 0.1,
            isVertical: Math.abs(x1 - x2) < 0.1
        });
    }
    
    /**
     * Draws the outer walls of the maze
     * @param {THREE.Scene} scene - The Three.js scene
     * @param {number} width - Maze width
     * @param {number} height - Maze height
     * @param {number} offsetX - X offset for centering
     * @param {number} offsetZ - Z offset for centering
     */
    drawOuterWalls(scene, width, height, offsetX, offsetZ) {
        const mazeWidth = width * this.cellSize;
        const mazeHeight = height * this.cellSize;
        
        // Top wall
        this.drawWall(scene, 
            offsetX, offsetZ, 
            offsetX + mazeWidth, offsetZ);
        
        // Right wall
        this.drawWall(scene, 
            offsetX + mazeWidth, offsetZ, 
            offsetX + mazeWidth, offsetZ + mazeHeight);
        
        // Bottom wall
        this.drawWall(scene, 
            offsetX, offsetZ + mazeHeight, 
            offsetX + mazeWidth, offsetZ + mazeHeight);
        
        // Left wall
        this.drawWall(scene, 
            offsetX, offsetZ, 
            offsetX, offsetZ + mazeHeight);
    }
    
    /**
     * Gets the start position of the maze
     * @returns {Object} - Start position coordinates
     */
    getStartPosition() {
        return this.startPosition;
    }
    
    /**
     * Gets the end position of the maze
     * @returns {Object} - End position coordinates
     */
    getEndPosition() {
        return this.endPosition;
    }
    
    /**
     * Gets the walls for collision detection
     * @returns {Array} - Array of wall objects
     */
    getWalls() {
        return this.walls;
    }
    
    /**
     * Shuffles an array in place
     * @param {Array} array - The array to shuffle
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
} 