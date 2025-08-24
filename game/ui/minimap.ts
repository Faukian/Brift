/**
 * Minimap UI for the game
 * Displays a small overview of the game world and player position
 */

export class MinimapUI {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private worldWidth: number;
    private worldHeight: number;
    private minimapSize: number = 150;
    private padding: number = 10;

    constructor(canvas: HTMLCanvasElement, worldWidth: number, worldHeight: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    render(
        playerPosition: { x: number; y: number },
        enemies: Array<{ x: number; y: number }>,
        towers: Array<{ x: number; y: number }>,
        buildings: Array<{ x: number; y: number }>
    ): void {
        this.renderMinimapBackground();
        this.renderWorldElements(enemies, towers, buildings);
        this.renderPlayerPosition(playerPosition);
        this.renderMinimapBorder();
    }

    private renderMinimapBackground(): void {
        // Render minimap background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(
            this.canvas.width - this.minimapSize - this.padding,
            this.padding,
            this.minimapSize,
            this.minimapSize
        );
    }

    private renderWorldElements(
        enemies: Array<{ x: number; y: number }>,
        towers: Array<{ x: number; y: number }>,
        buildings: Array<{ x: number; y: number }>
    ): void {
        // Render enemies as red dots
        this.ctx.fillStyle = '#ff0000';
        enemies.forEach(enemy => {
            const minimapX = this.worldToMinimapX(enemy.x);
            const minimapY = this.worldToMinimapY(enemy.y);
            this.ctx.fillRect(minimapX - 1, minimapY - 1, 2, 2);
        });

        // Render towers as blue dots
        this.ctx.fillStyle = '#0000ff';
        towers.forEach(tower => {
            const minimapX = this.worldToMinimapX(tower.x);
            const minimapY = this.worldToMinimapY(tower.y);
            this.ctx.fillRect(minimapX - 1, minimapY - 1, 2, 2);
        });

        // Render buildings as green dots
        this.ctx.fillStyle = '#00ff00';
        buildings.forEach(building => {
            const minimapX = this.worldToMinimapX(building.x);
            const minimapY = this.worldToMinimapY(building.y);
            this.ctx.fillRect(minimapX - 1, minimapY - 1, 2, 2);
        });
    }

    private renderPlayerPosition(playerPosition: { x: number; y: number }): void {
        // Render player as white dot
        this.ctx.fillStyle = '#ffffff';
        const minimapX = this.worldToMinimapX(playerPosition.x);
        const minimapY = this.worldToMinimapY(playerPosition.y);
        this.ctx.fillRect(minimapX - 2, minimapY - 2, 4, 4);
    }

    private renderMinimapBorder(): void {
        // Render minimap border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            this.canvas.width - this.minimapSize - this.padding,
            this.padding,
            this.minimapSize,
            this.minimapSize
        );
    }

    private worldToMinimapX(worldX: number): number {
        return this.canvas.width - this.minimapSize - this.padding + 
               (worldX / this.worldWidth) * this.minimapSize;
    }

    private worldToMinimapY(worldY: number): number {
        return this.padding + (worldY / this.worldHeight) * this.minimapSize;
    }
}
