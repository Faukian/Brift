/**
 * Reusable UI buttons for the game
 * Handles button rendering, interaction, and styling
 */

export interface ButtonConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    onClick: () => void;
    enabled?: boolean;
    style?: 'primary' | 'secondary' | 'danger';
}

export class Button {
    private config: ButtonConfig;
    private isHovered: boolean = false;
    private isPressed: boolean = false;

    constructor(config: ButtonConfig) {
        this.config = config;
    }

    render(ctx: CanvasRenderingContext2D): void {
        const { x, y, width, height, text, enabled = true, style = 'primary' } = this.config;

        // Determine button colors based on state and style
        let backgroundColor: string;
        let textColor: string = '#ffffff';

        if (!enabled) {
            backgroundColor = '#666666';
        } else if (this.isPressed) {
            backgroundColor = this.getPressedColor(style);
        } else if (this.isHovered) {
            backgroundColor = this.getHoverColor(style);
        } else {
            backgroundColor = this.getNormalColor(style);
        }

        // Draw button background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(x, y, width, height);

        // Draw button border
        ctx.strokeStyle = enabled ? '#ffffff' : '#999999';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw button text
        ctx.fillStyle = textColor;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + width / 2, y + height / 2);
    }

    handleMouseMove(mouseX: number, mouseY: number): void {
        const { x, y, width, height, enabled = true } = this.config;
        
        if (!enabled) return;

        this.isHovered = mouseX >= x && mouseX <= x + width && 
                         mouseY >= y && mouseY <= y + height;
    }

    handleMouseDown(mouseX: number, mouseY: number): boolean {
        const { x, y, width, height, enabled = true } = this.config;
        
        if (!enabled) return false;

        if (mouseX >= x && mouseX <= x + width && 
            mouseY >= y && mouseY <= y + height) {
            this.isPressed = true;
            return true;
        }
        return false;
    }

    handleMouseUp(mouseX: number, mouseY: number): boolean {
        const { x, y, width, height, enabled = true, onClick } = this.config;
        
        if (!enabled) return false;

        if (this.isPressed) {
            this.isPressed = false;
            
            if (mouseX >= x && mouseX <= x + width && 
                mouseY >= y && mouseY <= y + height) {
                onClick();
                return true;
            }
        }
        return false;
    }

    private getNormalColor(style: string): string {
        switch (style) {
            case 'primary': return '#4CAF50';
            case 'secondary': return '#2196F3';
            case 'danger': return '#f44336';
            default: return '#4CAF50';
        }
    }

    private getHoverColor(style: string): string {
        switch (style) {
            case 'primary': return '#45a049';
            case 'secondary': return '#1976D2';
            case 'danger': return '#da190b';
            default: return '#45a049';
        }
    }

    private getPressedColor(style: string): string {
        switch (style) {
            case 'primary': return '#3d8b40';
            case 'secondary': return '#1565C0';
            case 'danger': return '#c62828';
            default: return '#3d8b40';
        }
    }
}
