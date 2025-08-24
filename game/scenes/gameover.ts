/**
 * Game over scene for the game
 * Handles game over screen, final score, and restart options
 */

import { Scene } from './scene.js';
import { SceneManager } from './sceneManager.js';

export class GameOverScene extends Scene {
    private sceneManager: SceneManager;
    private finalScore: number;
    private waveNumber: number;

    constructor(sceneManager: SceneManager, finalScore: number, waveNumber: number) {
        super();
        this.sceneManager = sceneManager;
        this.finalScore = finalScore;
        this.waveNumber = waveNumber;
    }

    protected onEnter(): void {
        // Initialize game over UI
        this.setupGameOverUI();
    }

    protected onExit(): void {
        // Clean up game over resources
    }

    protected onPause(): void {
        // Handle game over pause
    }

    protected onResume(): void {
        // Handle game over resume
    }

    protected onUpdate(deltaTime: number): void {
        // Handle game over menu input
    }

    protected onRender(ctx: CanvasRenderingContext2D): void {
        // Render game over screen
        this.renderGameOverBackground(ctx);
        this.renderFinalStats(ctx);
        this.renderGameOverMenu(ctx);
    }

    protected onReset(): void {
        // Reset game over state
    }

    private setupGameOverUI(): void {
        // Setup game over menu buttons
        console.log('Game Over UI setup complete');
    }

    private renderGameOverBackground(ctx: CanvasRenderingContext2D): void {
        // Render game over background
        ctx.fillStyle = '#8b0000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    private renderFinalStats(ctx: CanvasRenderingContext2D): void {
        // Render final score and wave number
        ctx.fillStyle = '#ffffff';
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', ctx.canvas.width / 2, ctx.canvas.height / 3);
        
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${this.finalScore}`, ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.fillText(`Wave: ${this.waveNumber}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 30);
    }

    private renderGameOverMenu(ctx: CanvasRenderingContext2D): void {
        // Render restart and menu options
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press R to Restart', ctx.canvas.width / 2, ctx.canvas.height * 0.7);
        ctx.fillText('Press M for Menu', ctx.canvas.width / 2, ctx.canvas.height * 0.7 + 30);
    }

    private restartGame(): void {
        // Restart the game
        this.sceneManager.setScene('gameplay', false);
    }

    private returnToMenu(): void {
        // Return to main menu
        this.sceneManager.setScene('menu', false);
    }
}
