/**
 * HUD (Heads Up Display) for the game
 * Displays player stats, resources, and game information
 */

export class HUD {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    render(
        playerHealth: number,
        playerResources: number,
        waveNumber: number,
        enemiesRemaining: number,
        score: number
    ): void {
        this.renderHealthBar(playerHealth);
        this.renderResourceDisplay(playerResources);
        this.renderWaveInfo(waveNumber, enemiesRemaining);
        this.renderScore(score);
    }

    private renderHealthBar(health: number): void {
        // Render player health bar
    }

    private renderResourceDisplay(resources: number): void {
        // Render player resource count
    }

    private renderWaveInfo(waveNumber: number, enemiesRemaining: number): void {
        // Render current wave and enemies remaining
    }

    private renderScore(score: number): void {
        // Render current score
    }

    private drawText(text: string, x: number, y: number, color: string = '#ffffff'): void {
        // Helper method to draw text
        this.ctx.fillStyle = color;
        this.ctx.font = '16px Arial';
        this.ctx.fillText(text, x, y);
    }

    private drawRect(x: number, y: number, width: number, height: number, color: string): void {
        // Helper method to draw rectangles
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
}
