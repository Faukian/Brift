/**
 * Main menu scene for the game
 * Handles menu navigation, game start, and settings
 */

import { Scene } from './scene.js';
import { SceneManager } from './sceneManager.js';
import { MenuUI } from '../ui/menu.js';
import { InputManager } from '../core/input.js';

export class MenuScene extends Scene {
    private sceneManager: SceneManager;
    private menuUI: MenuUI;
    private input: InputManager;

    constructor(sceneManager: SceneManager, input: InputManager) {
        super();
        this.sceneManager = sceneManager;
        this.input = input;
        
        // Create menu UI with start game callback
        this.menuUI = new MenuUI(() => {
            this.startGame();
        });
    }

    protected onEnter(): void {
        // Initialize menu UI elements
        this.setupMenuUI();
        console.log('Menu scene entered, MenuUI initialized');
    }

    protected onExit(): void {
        // Clean up menu resources
    }

    protected onPause(): void {
        // Handle menu pause
    }

    protected onResume(): void {
        // Handle menu resume
    }

    protected onUpdate(deltaTime: number): void {
        // Update menu UI animations
        this.menuUI.update(deltaTime);
    }

    protected onRender(ctx: CanvasRenderingContext2D): void {

        
        // Render the menu UI (title, button, decorative elements)
        if (this.menuUI) {
            this.menuUI.render(ctx);
        } else {
            // Fallback if MenuUI is not initialized
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('MenuUI not initialized!', ctx.canvas.width / 2, ctx.canvas.height / 2);
        }
    }

    protected onReset(): void {
        // Reset menu state
    }

    private setupMenuUI(): void {
        // Setup menu buttons and navigation
        console.log('Menu UI setup complete');
    }

    private startGame(): void {
        console.log('Starting game...');
        this.sceneManager.setScene('gameplay', true);
    }

    // Mouse input handling methods for the main game loop
    public handleMouseMove(mouseX: number, mouseY: number): void {
        this.menuUI.handleMouseMove(mouseX, mouseY);
    }

    public handleMouseDown(mouseX: number, mouseY: number): void {
        this.menuUI.handleMouseDown(mouseX, mouseY);
    }

    public handleMouseUp(mouseX: number, mouseY: number): void {
        this.menuUI.handleMouseUp(mouseX, mouseY);
    }
}
