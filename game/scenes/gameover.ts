/**
 * Game over scene for the game
 * Handles game over screen, final score, and restart options
 */

import { Scene } from './scene';
import { SceneManager } from './sceneManager';

export class GameOverScene extends Scene {
    private finalScore: number;
    private waveNumber: number;

    constructor(sceneManager: SceneManager, finalScore: number, waveNumber: number) {
        super(sceneManager);
        this.finalScore = finalScore;
        this.waveNumber = waveNumber;
    }

    init(): void {
        // Initialize game over UI
        this.setupGameOverUI();
    }

    update(deltaTime: number): void {
        // Handle game over menu input
    }

    render(ctx: CanvasRenderingContext2D): void {
        // Render game over screen
        this.renderGameOverBackground(ctx);
        this.renderFinalStats(ctx);
        this.renderGameOverMenu(ctx);
    }

    private setupGameOverUI(): void {
        // Setup game over menu buttons
    }

    private renderGameOverBackground(ctx: CanvasRenderingContext2D): void {
        // Render game over background
    }

    private renderFinalStats(ctx: CanvasRenderingContext2D): void {
        // Render final score and wave number
    }

    private renderGameOverMenu(ctx: CanvasRenderingContext2D): void {
        // Render restart and menu options
    }

    private restartGame(): void {
        // Restart the game
        this.sceneManager.switchTo('gameplay');
    }

    private returnToMenu(): void {
        // Return to main menu
        this.sceneManager.switchTo('menu');
    }

    cleanup(): void {
        // Clean up game over resources
    }
}
