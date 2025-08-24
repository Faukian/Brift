/**
 * RenderSystem draws entities with Position and Sprite components
 * Enhanced with debug features and performance monitoring
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { Position } from '../components/position.js';
import { Sprite } from '../components/sprite.js';
import { DEBUG_MODE, SHOW_HITBOXES, SHOW_FPS, SHOW_ENTITY_COUNT, SHOW_PERFORMANCE, DEBUG_TOGGLE_KEY } from '../constants.js';
import { DebugUtils, CanvasUtils } from '../core/utils.js';

export class RenderSystem extends System {
    private debugCtx: CanvasRenderingContext2D | null = null;
    private debugCanvas: HTMLCanvasElement | null = null;
    private debugModeEnabled: boolean = true;

    constructor(world: any) {
        super(world, ['position', 'sprite']);
        this.setupDebugCanvas();
    }

    private setupDebugCanvas(): void {
        if (!DEBUG_MODE) return;

        // Create debug canvas overlay
        this.debugCanvas = document.createElement('canvas');
        this.debugCanvas.id = 'debug-canvas';
        this.debugCanvas.style.position = 'absolute';
        this.debugCanvas.style.top = '0';
        this.debugCanvas.style.left = '0';
        this.debugCanvas.style.pointerEvents = 'none';
        this.debugCanvas.style.zIndex = '1000';
        
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.appendChild(this.debugCanvas);
            this.debugCtx = this.debugCanvas.getContext('2d')!;
            
            // Make debug canvas responsive
            CanvasUtils.makeResponsive(this.debugCanvas, 1280, 720);
        }
    }

    public update(deltaTime: number, entities: Entity[]): void {
        // Render system doesn't need update logic for the demo
    }

    public render(ctx: CanvasRenderingContext2D, entities: Entity[]): void {
        // Render each entity
        for (const entity of entities) {
            const position = entity.getComponent('position') as Position;
            const sprite = entity.getComponent('sprite') as Sprite;

            if (position && sprite) {
                // Draw the sprite as a colored rectangle
                ctx.fillStyle = sprite.color;
                ctx.fillRect(
                    position.x - sprite.width / 2,
                    position.y - sprite.height / 2,
                    sprite.width,
                    sprite.height
                );

                        // Draw debug hitbox if enabled
        if (DEBUG_MODE && SHOW_HITBOXES && this.debugModeEnabled) {
            this.drawHitbox(ctx, position, sprite);
        }
            }
        }

        // Render debug information
        if (DEBUG_MODE && this.debugModeEnabled) {
            this.renderDebugInfo(ctx, entities);
        }
    }

    private drawHitbox(ctx: CanvasRenderingContext2D, position: Position, sprite: Sprite): void {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(
            position.x - sprite.width / 2,
            position.y - sprite.height / 2,
            sprite.width,
            sprite.height
        );
        ctx.setLineDash([]);
    }

    private renderDebugInfo(ctx: CanvasRenderingContext2D, entities: Entity[]): void {
        const debugY = 20;
        let yOffset = 0;

        // FPS counter
        if (SHOW_FPS) {
            const fps = DebugUtils.getFPS();
            const fpsColor = this.getPerformanceColor(fps);
            this.drawDebugText(ctx, `FPS: ${fps}`, 10, debugY + yOffset, fpsColor);
            yOffset += 20;
        }

        // Entity count
        if (SHOW_ENTITY_COUNT) {
            this.drawDebugText(ctx, `Entities: ${entities.length}`, 10, debugY + yOffset, '#ffffff');
            yOffset += 20;
        }

        // Performance metrics
        if (SHOW_PERFORMANCE) {
            const avgFrameTime = DebugUtils.getAverageFrameTime();
            const performanceStatus = DebugUtils.getPerformanceStatus();
            const statusColor = this.getPerformanceColor(performanceStatus);
            
            this.drawDebugText(ctx, `Frame Time: ${avgFrameTime.toFixed(2)}ms`, 10, debugY + yOffset, statusColor);
            yOffset += 20;
            this.drawDebugText(ctx, `Status: ${performanceStatus.toUpperCase()}`, 10, debugY + yOffset, statusColor);
            yOffset += 20;
        }

        // Debug mode status
        this.drawDebugText(ctx, `Debug: ${this.debugModeEnabled ? 'ON' : 'OFF'}`, 10, debugY + yOffset, '#00ffff');
        yOffset += 20;
        this.drawDebugText(ctx, `Press ${DEBUG_TOGGLE_KEY} to toggle`, 10, debugY + yOffset, '#888888');
    }

    private drawDebugText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string): void {
        ctx.fillStyle = '#000000';
        ctx.fillRect(x - 2, y - 12, ctx.measureText(text).width + 4, 16);
        ctx.fillStyle = color;
        ctx.font = '12px monospace';
        ctx.fillText(text, x, y);
    }

    private getPerformanceColor(value: number | string): string {
        if (typeof value === 'number') {
            if (value >= 50) return '#00ff00'; // Green for good FPS
            if (value >= 30) return '#ffff00'; // Yellow for warning
            return '#ff0000'; // Red for critical
        }
        
        // Handle performance status string
        switch (value) {
            case 'good': return '#00ff00';
            case 'warning': return '#ffff00';
            case 'critical': return '#ff0000';
            default: return '#ffffff';
        }
    }

    public toggleDebugMode(): void {
        this.debugModeEnabled = !this.debugModeEnabled;
        console.log(`Debug mode ${this.debugModeEnabled ? 'enabled' : 'disabled'}`);
    }

    public isDebugModeEnabled(): boolean {
        return this.debugModeEnabled;
    }
}
