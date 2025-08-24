/**
 * Main game entry point
 * Enhanced with debug features and performance monitoring
 */

import { World } from './core/ecs/world.js';
import { InputManager } from './core/input.js';
import { PhysicsSystem } from './systems/physics.js';
import { RenderSystem } from './systems/render.js';
import { InputSystem } from './systems/input.js';
import { PlayerFactory } from './entities/player.js';
import { DebugUtils, CanvasUtils } from './core/utils.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEBUG_MODE, DEBUG_TOGGLE_KEY, DEBUG_CANVAS_ID } from './constants.js';
import { SceneManager } from './scenes/sceneManager.js';
import { MenuScene } from './scenes/menu.js';
import { GameplayScene } from './scenes/gameplay.js';
import { Camera } from './core/camera.js';

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private world: World;
    private input: InputManager;
    private playerFactory: PlayerFactory;
    private sceneManager: SceneManager;
    private lastTime: number = 0;
    private isRunning: boolean = false;
    private frameCount: number = 0;

    constructor() {
        this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error('Canvas element not found!');
        }
        
        this.ctx = this.canvas.getContext('2d')!;
        if (!this.ctx) {
            throw new Error('Could not get 2D context!');
        }
        
        // Set canvas size to window dimensions
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Make canvas responsive
        CanvasUtils.makeResponsive(this.canvas, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        this.world = new World();
        this.input = new InputManager();
        this.playerFactory = new PlayerFactory(this.world);
        this.sceneManager = new SceneManager();
        
        this.init();
        this.setupDebugControls();
        this.setupMouseInput();
    }

    private async init(): Promise<void> {
        try {
            // Load player configuration first
            await this.playerFactory.loadConfig();
            
            // Initialize scenes
            this.initializeScenes();
            
            // Set initial scene to menu
            this.sceneManager.setScene('menu', false);
            
            // Verify scene is set
            const currentScene = this.sceneManager.getCurrentScene();
            if (!currentScene) {
                throw new Error('Failed to set initial scene!');
            }
            console.log('Initial scene set:', this.sceneManager.getCurrentSceneName());
            
            // Start game loop
            this.isRunning = true;
            this.gameLoop();
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    private initializeScenes(): void {
        // Create and add scenes
        const menuScene = new MenuScene(this.sceneManager, this.input);
        const camera = new Camera();
        const gameplayScene = new GameplayScene(this.world, this.input, camera, this.sceneManager);
        
        this.sceneManager.addScene('menu', menuScene);
        this.sceneManager.addScene('gameplay', gameplayScene);
        
        console.log('Scenes initialized');
    }

    private gameLoop(currentTime: number = 0): void {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update performance tracking
        DebugUtils.updateFPS(currentTime);
        if (deltaTime > 0) {
            DebugUtils.trackFrameTime(deltaTime * 1000);
        }

        // Update current scene
        this.sceneManager.update(deltaTime);
        
        // Render current scene
        this.render();

        this.frameCount++;
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    private render(): void {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        

        
        // Render current scene
        this.sceneManager.render(this.ctx);
    }

    public pause(): void {
        this.isRunning = false;
    }

    public resume(): void {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    public getStats(): { frameCount: number; entityCount: number; systemCount: number } {
        return {
            frameCount: this.frameCount,
            entityCount: this.world.getEntityCount(),
            systemCount: this.world.getSystemCount()
        };
    }

    private setupDebugControls(): void {
        if (!DEBUG_MODE) return;
        
        // Debug key to toggle debug mode
        document.addEventListener('keydown', (event) => {
            if (event.code === DEBUG_TOGGLE_KEY) {
                event.preventDefault();
                this.toggleDebugMode();
            }
        });
    }

    private toggleDebugMode(): void {
        // Toggle debug canvas visibility
        const debugCanvas = document.getElementById(DEBUG_CANVAS_ID);
        if (debugCanvas) {
            debugCanvas.style.display = debugCanvas.style.display === 'none' ? 'block' : 'none';
        }
        
        // Toggle debug info in render system
        const renderSystem = this.world.getSystems().find(s => s.constructor.name === 'RenderSystem') as any;
        if (renderSystem && renderSystem.toggleDebugMode) {
            renderSystem.toggleDebugMode();
        }
    }

    private setupMouseInput(): void {
        // Handle mouse input for UI interactions
        this.canvas.addEventListener('mousemove', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            // Scale mouse coordinates to canvas coordinates
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const scaledX = mouseX * scaleX;
            const scaledY = mouseY * scaleY;
            
            this.handleMouseMove(scaledX, scaledY);
        });

        this.canvas.addEventListener('mousedown', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const scaledX = mouseX * scaleX;
            const scaledY = mouseY * scaleY;
            
            this.handleMouseDown(scaledX, scaledY);
        });

        this.canvas.addEventListener('mouseup', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const scaledX = mouseX * scaleX;
            const scaledY = mouseY * scaleY;
            
            this.handleMouseUp(scaledX, scaledY);
        });
    }

    private handleMouseMove(mouseX: number, mouseY: number): void {
        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene && 'handleMouseMove' in currentScene) {
            (currentScene as any).handleMouseMove(mouseX, mouseY);
        }
    }

    private handleMouseDown(mouseX: number, mouseY: number): void {
        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene && 'handleMouseDown' in currentScene) {
            (currentScene as any).handleMouseDown(mouseX, mouseY);
        }
    }

    private handleMouseUp(mouseX: number, mouseY: number): void {
        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene && 'handleMouseUp' in currentScene) {
            (currentScene as any).handleMouseUp(mouseX, mouseY);
        }
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
