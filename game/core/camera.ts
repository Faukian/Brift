/**
 * Camera class manages viewport and coordinate transformations
 * Handles panning, zooming, and world-to-screen coordinate conversion
 */

export class Camera {
    private x: number;
    private y: number;
    private zoom: number;
    private targetX: number;
    private targetY: number;
    private targetZoom: number;
    private smoothness: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1.0;
        this.targetX = 0;
        this.targetY = 0;
        this.targetZoom = 1.0;
        this.smoothness = 0.1;
    }

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
    }

    public setTarget(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;
    }

    public setZoom(zoom: number): void {
        this.zoom = Math.max(0.1, Math.min(3.0, zoom));
        this.targetZoom = this.zoom;
    }

    public setTargetZoom(zoom: number): void {
        this.targetZoom = Math.max(0.1, Math.min(3.0, zoom));
    }

    public getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    public getZoom(): number {
        return this.zoom;
    }

    public update(deltaTime: number): void {
        // Smooth camera movement
        this.x += (this.targetX - this.x) * this.smoothness;
        this.y += (this.targetY - this.y) * this.smoothness;
        this.zoom += (this.targetZoom - this.zoom) * this.smoothness;
    }

    public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
        const screenX = (worldX - this.x) * this.zoom + 640; // Half canvas width
        const screenY = (worldY - this.y) * this.zoom + 360; // Half canvas height
        return { x: screenX, y: screenY };
    }

    public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
        const worldX = (screenX - 640) / this.zoom + this.x;
        const worldY = (screenY - 360) / this.zoom + this.y;
        return { x: worldX, y: worldY };
    }

    public followTarget(targetX: number, targetY: number): void {
        this.setTarget(targetX, targetY);
    }

    public pan(deltaX: number, deltaY: number): void {
        this.x += deltaX / this.zoom;
        this.y += deltaY / this.zoom;
        this.targetX = this.x;
        this.targetY = this.y;
    }

    public zoomIn(factor: number = 1.2): void {
        this.setTargetZoom(this.zoom * factor);
    }

    public zoomOut(factor: number = 1.2): void {
        this.setTargetZoom(this.zoom / factor);
    }

    public reset(): void {
        this.x = 0;
        this.y = 0;
        this.zoom = 1.0;
        this.targetX = 0;
        this.targetY = 0;
        this.targetZoom = 1.0;
    }
}
