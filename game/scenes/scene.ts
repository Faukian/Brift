/**
 * Base Scene class that all game scenes inherit from
 * Provides common scene functionality and lifecycle methods
 */

export abstract class Scene {
    protected isActive: boolean;
    protected isPaused: boolean;
    protected sceneTime: number;
    protected entities: any[]; // Scene-specific entities

    constructor() {
        this.isActive = false;
        this.isPaused = false;
        this.sceneTime = 0;
        this.entities = [];
    }

    /**
     * Called when the scene becomes active
     */
    public enter(): void {
        this.isActive = true;
        this.isPaused = false;
        this.sceneTime = 0;
        this.onEnter();
        console.log(`Entered scene: ${this.constructor.name}`);
    }

    /**
     * Called when the scene becomes inactive
     */
    public exit(): void {
        this.isActive = false;
        this.onExit();
        console.log(`Exited scene: ${this.constructor.name}`);
    }

    /**
     * Called when the scene is paused
     */
    public pause(): void {
        this.isPaused = true;
        this.onPause();
        console.log(`Paused scene: ${this.constructor.name}`);
    }

    /**
     * Called when the scene is resumed
     */
    public resume(): void {
        this.isPaused = false;
        this.onResume();
        console.log(`Resumed scene: ${this.constructor.name}`);
    }

    /**
     * Called every frame to update the scene
     */
    public update(deltaTime: number): void {
        if (!this.isActive || this.isPaused) return;

        this.sceneTime += deltaTime;
        this.onUpdate(deltaTime);
    }

    /**
     * Called every frame to render the scene
     */
    public render(ctx: CanvasRenderingContext2D): void {
        if (!this.isActive) return;

        this.onRender(ctx);
    }

    /**
     * Called when the scene is reset
     */
    public reset(): void {
        this.sceneTime = 0;
        this.entities = [];
        this.onReset();
        console.log(`Reset scene: ${this.constructor.name}`);
    }

    /**
     * Check if the scene is currently active
     */
    public isSceneActive(): boolean {
        return this.isActive;
    }

    /**
     * Check if the scene is currently paused
     */
    public isScenePaused(): boolean {
        return this.isPaused;
    }

    /**
     * Get the total time the scene has been active
     */
    public getSceneTime(): number {
        return this.sceneTime;
    }

    /**
     * Get all entities in the scene
     */
    public getEntities(): any[] {
        return [...this.entities];
    }

    /**
     * Add an entity to the scene
     */
    public addEntity(entity: any): void {
        this.entities.push(entity);
    }

    /**
     * Remove an entity from the scene
     */
    public removeEntity(entity: any): void {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    /**
     * Find entities by type or condition
     */
    public findEntities(condition: (entity: any) => boolean): any[] {
        return this.entities.filter(condition);
    }

    /**
     * Clear all entities from the scene
     */
    public clearEntities(): void {
        this.entities = [];
    }

    // Abstract methods that scenes must implement

    /**
     * Called when entering the scene
     */
    protected abstract onEnter(): void;

    /**
     * Called when exiting the scene
     */
    protected abstract onExit(): void;

    /**
     * Called when pausing the scene
     */
    protected abstract onPause(): void;

    /**
     * Called when resuming the scene
     */
    protected abstract onResume(): void;

    /**
     * Called every frame to update the scene
     */
    protected abstract onUpdate(deltaTime: number): void;

    /**
     * Called every frame to render the scene
     */
    protected abstract onRender(ctx: CanvasRenderingContext2D): void;

    /**
     * Called when resetting the scene
     */
    protected abstract onReset(): void;
}
