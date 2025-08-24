/**
 * Main game entry point
 * Simple demo with ECS core and player movement
 */

import { World } from './core/ecs/world.js';
import { InputManager } from './core/input.js';
import { PhysicsSystem } from './systems/physics.js';
import { RenderSystem } from './systems/render.js';
import { InputSystem } from './systems/input.js';
import { PlayerFactory } from './entities/player.js';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private world: World;
    private input: InputManager;
    private playerFactory: PlayerFactory;
    private lastTime: number = 0;
    private isRunning: boolean = false;

    constructor() {
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        
        this.world = new World();
        this.input = new InputManager();
        this.playerFactory = new PlayerFactory(this.world);
        
        this.init();
    }

    private async init(): Promise<void> {
        try {
            // Load player configuration first
            await this.playerFactory.loadConfig();
            
            // Initialize game systems
            this.world.addSystem(new InputSystem(this.world, this.input, this.playerFactory));
            this.world.addSystem(new PhysicsSystem(this.world));
            this.world.addSystem(new RenderSystem(this.world));
            
            // Create player entity using loaded configuration
            this.playerFactory.createPlayer(this.canvas.width / 2, this.canvas.height / 2);
            
            // Start game loop
            this.isRunning = true;
            this.gameLoop();
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    private gameLoop(currentTime: number = 0): void {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update world
        this.world.update(deltaTime);
        
        // Render world
        this.render();

        requestAnimationFrame((time) => this.gameLoop(time));
    }

    private render(): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render world
        this.world.render(this.ctx);
    }

    public pause(): void {
        this.isRunning = false;
    }

    public resume(): void {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
