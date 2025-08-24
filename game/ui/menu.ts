/**
 * Menu UI for the Brift game
 * Handles rendering the main menu with title, button, and decorative elements
 */

import { Button } from './buttons.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

export interface MenuUI {
    title: string;
    startButton: Button;
    decorativeElements: DecorativeElement[];
}

export interface DecorativeElement {
    type: 'star' | 'cloud' | 'circle' | 'triangle';
    x: number;
    y: number;
    size: number;
    color: string;
    rotation: number;
    animationSpeed: number;
}

export class MenuUI {
    private title: string;
    private startButton: Button;
    private decorativeElements: DecorativeElement[];
    private animationTime: number = 0;

    constructor(onStartGame: () => void) {
        this.title = 'Brift';
        this.startButton = new Button({
            x: 0, // Will be set in render method based on actual canvas size
            y: 0, // Will be set in render method based on actual canvas size
            width: 200,
            height: 60,
            text: 'Start Game',
            onClick: onStartGame,
            style: 'primary'
        });

        // Create decorative elements for cartoon style
        this.decorativeElements = this.createDecorativeElements();
    }

    public update(deltaTime: number): void {
        this.animationTime += deltaTime;
        
        // Update decorative element animations
        this.decorativeElements.forEach(element => {
            element.rotation += element.animationSpeed * deltaTime;
        });
    }

    public render(ctx: CanvasRenderingContext2D): void {

        
        // Clear background with gradient
        this.renderBackground(ctx);
        
        // Render decorative elements
        this.renderDecorativeElements(ctx);
        
        // Render title
        this.renderTitle(ctx);
        
        // Update button position based on actual canvas size
        this.startButton.setPosition(ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 50);
        
        // Render start button
        this.startButton.render(ctx);
        

    }

    public handleMouseMove(mouseX: number, mouseY: number): void {
        this.startButton.handleMouseMove(mouseX, mouseY);
    }

    public handleMouseDown(mouseX: number, mouseY: number): boolean {
        return this.startButton.handleMouseDown(mouseX, mouseY);
    }

    public handleMouseUp(mouseX: number, mouseY: number): boolean {
        return this.startButton.handleMouseUp(mouseX, mouseY);
    }

    private renderBackground(ctx: CanvasRenderingContext2D): void {
        // Create gradient background using actual canvas dimensions
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');   // Dark blue at top
        gradient.addColorStop(0.5, '#16213e'); // Medium blue in middle
        gradient.addColorStop(1, '#0f3460');   // Darker blue at bottom
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    private renderTitle(ctx: CanvasRenderingContext2D): void {
        // Title shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.title, ctx.canvas.width / 2 + 4, ctx.canvas.height / 3 + 4);

        // Main title with gradient
        const titleGradient = ctx.createLinearGradient(
            ctx.canvas.width / 2 - 100, 
            ctx.canvas.height / 3 - 40, 
            ctx.canvas.width / 2 + 100, 
            ctx.canvas.height / 3 + 40
        );
        titleGradient.addColorStop(0, '#ff6b6b');   // Bright red
        titleGradient.addColorStop(0.5, '#ffd93d'); // Bright yellow
        titleGradient.addColorStop(1, '#6bcf7f');   // Bright green

        ctx.fillStyle = titleGradient;
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.title, ctx.canvas.width / 2, ctx.canvas.height / 3);

        // Title outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeText(this.title, ctx.canvas.width / 2, ctx.canvas.height / 3);
    }

    private renderDecorativeElements(ctx: CanvasRenderingContext2D): void {
        this.decorativeElements.forEach(element => {
            ctx.save();
            ctx.translate(element.x, element.y);
            ctx.rotate(element.rotation);
            
            switch (element.type) {
                case 'star':
                    this.drawStar(ctx, 0, 0, element.size, element.color);
                    break;
                case 'cloud':
                    this.drawCloud(ctx, 0, 0, element.size, element.color);
                    break;
                case 'circle':
                    this.drawCircle(ctx, 0, 0, element.size, element.color);
                    break;
                case 'triangle':
                    this.drawTriangle(ctx, 0, 0, element.size, element.color);
                    break;
            }
            
            ctx.restore();
        });
    }

    private drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const outerRadius = size;
            const innerRadius = size * 0.4;
            
            if (i === 0) {
                ctx.moveTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
            } else {
                ctx.lineTo(x + Math.cos(angle) * outerRadius, y + Math.sin(angle) * outerRadius);
            }
            
            const nextAngle = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
            ctx.lineTo(x + Math.cos(nextAngle) * innerRadius, y + Math.sin(nextAngle) * innerRadius);
        }
        
        ctx.closePath();
        ctx.fill();
    }

    private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        
        // Draw multiple circles to form a cloud shape
        ctx.arc(x, y, size * 0.6, 0, 2 * Math.PI);
        ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.4, 0, 2 * Math.PI);
        ctx.arc(x + size * 0.6, y + size * 0.1, size * 0.3, 0, 2 * Math.PI);
        ctx.arc(x - size * 0.3, y + size * 0.2, size * 0.4, 0, 2 * Math.PI);
        
        ctx.fill();
    }

    private drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
    }

    private drawTriangle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size * 0.866, y + size * 0.5);
        ctx.lineTo(x + size * 0.866, y + size * 0.5);
        ctx.closePath();
        ctx.fill();
    }

    private createDecorativeElements(): DecorativeElement[] {
        return [
            // Stars
            { type: 'star', x: 150, y: 100, size: 15, color: '#ffd93d', rotation: 0, animationSpeed: 1 },
            { type: 'star', x: 1130, y: 120, size: 12, color: '#ff6b6b', rotation: 0, animationSpeed: 0.8 },
            { type: 'star', x: 200, y: 570, size: 18, color: '#6bcf7f', rotation: 0, animationSpeed: 1.2 },
            
            // Clouds
            { type: 'cloud', x: 80, y: 80, size: 25, color: '#74b9ff', rotation: 0, animationSpeed: 0.3 },
            { type: 'cloud', x: 1180, y: 620, size: 30, color: '#a29bfe', rotation: 0, animationSpeed: 0.4 },
            
            // Circles
            { type: 'circle', x: 300, y: 200, size: 8, color: '#fd79a8', rotation: 0, animationSpeed: 0.6 },
            { type: 'circle', x: 1030, y: 300, size: 10, color: '#00cec9', rotation: 0, animationSpeed: 0.7 },
            
            // Triangles
            { type: 'triangle', x: 400, y: 150, size: 12, color: '#fdcb6e', rotation: 0, animationSpeed: 0.9 },
            { type: 'triangle', x: 930, y: 520, size: 14, color: '#e17055', rotation: 0, animationSpeed: 1.1 }
        ];
    }
}
