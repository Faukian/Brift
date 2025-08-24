/**
 * Upgrades UI for the game
 * Handles tower upgrades, player upgrades, and upgrade selection
 */

export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'tower' | 'player' | 'global';
    effect: string;
}

export class UpgradesUI {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private availableUpgrades: Upgrade[] = [];
    private selectedUpgrade: Upgrade | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    setAvailableUpgrades(upgrades: Upgrade[]): void {
        this.availableUpgrades = upgrades;
    }

    render(playerResources: number): void {
        this.renderUpgradePanel();
        this.renderUpgradeList();
        this.renderUpgradeDetails();
    }

    handleClick(x: number, y: number): boolean {
        // Handle upgrade selection and purchase
        return false;
    }

    private renderUpgradePanel(): void {
        // Render upgrade panel background
    }

    private renderUpgradeList(): void {
        // Render list of available upgrades
    }

    private renderUpgradeDetails(): void {
        // Render details of selected upgrade
    }

    private canAffordUpgrade(upgrade: Upgrade, playerResources: number): boolean {
        return playerResources >= upgrade.cost;
    }

    private purchaseUpgrade(upgrade: Upgrade): boolean {
        // Handle upgrade purchase logic
        return false;
    }

    private drawText(text: string, x: number, y: number, color: string = '#ffffff'): void {
        this.ctx.fillStyle = color;
        this.ctx.font = '14px Arial';
        this.ctx.fillText(text, x, y);
    }

    private drawButton(x: number, y: number, width: number, height: number, text: string, enabled: boolean = true): void {
        // Draw upgrade button
        this.ctx.fillStyle = enabled ? '#4CAF50' : '#666666';
        this.ctx.fillRect(x, y, width, height);
        
        if (enabled) {
            this.drawText(text, x + width / 2, y + height / 2 + 5, '#ffffff');
        }
    }
}
