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

        // Draw button background with rounded corners
        ctx.fillStyle = backgroundColor;
        this.drawRoundedRect(ctx, x, y, width, height, 8);

        // Draw button border with rounded corners
        ctx.strokeStyle = enabled ? '#ffffff' : '#999999';
        ctx.lineWidth = 2;
        this.strokeRoundedRect(ctx, x, y, width, height, 8);

        // Draw button text
        ctx.fillStyle = textColor;
        ctx.font = 'bold 20px Arial';
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

    public setPosition(x: number, y: number): void {
        this.config.x = x;
        this.config.y = y;
    }

    private getNormalColor(style: string): string {
        switch (style) {
            case 'primary': return '#ff6b6b';  // Bright red
            case 'secondary': return '#74b9ff'; // Bright blue
            case 'danger': return '#fd79a8';   // Bright pink
            default: return '#ff6b6b';
        }
    }

    private getHoverColor(style: string): string {
        switch (style) {
            case 'primary': return '#ff5252';  // Darker red
            case 'secondary': return '#0984e3'; // Darker blue
            case 'danger': return '#e84393';   // Darker pink
            default: return '#ff5252';
        }
    }

    private getPressedColor(style: string): string {
        switch (style) {
            case 'primary': return '#d32f2f';  // Even darker red
            case 'secondary': return '#1976d2'; // Even darker blue
            case 'danger': return '#c2185b';   // Even darker pink
            default: return '#d32f2f';
        }
    }

    private drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    private strokeRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.stroke();
    }
}
