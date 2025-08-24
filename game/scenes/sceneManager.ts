/**
 * SceneManager manages different game scenes and states
 * Handles scene transitions and updates
 */

import { Scene } from './scene.js';

export class SceneManager {
    private scenes: Map<string, Scene>;
    private currentScene: Scene | null;
    private nextScene: string | null;
    private transitionTime: number;
    private transitionDuration: number;
    private isTransitioning: boolean;

    constructor() {
        this.scenes = new Map();
        this.currentScene = null;
        this.nextScene = null;
        this.transitionTime = 0;
        this.transitionDuration = 1000; // 1 second transition
        this.isTransitioning = false;
    }

    public addScene(name: string, scene: Scene): void {
        this.scenes.set(name, scene);
        console.log(`Added scene: ${name}`);
    }

    public removeScene(name: string): void {
        this.scenes.delete(name);
        console.log(`Removed scene: ${name}`);
    }

    public setScene(name: string, transition: boolean = true): void {
        if (!this.scenes.has(name)) {
            console.error(`Scene not found: ${name}`);
            return;
        }

        if (transition && this.currentScene) {
            this.startTransition(name);
        } else {
            this.switchScene(name);
        }
    }

    private startTransition(sceneName: string): void {
        this.nextScene = sceneName;
        this.transitionTime = 0;
        this.isTransitioning = true;
        console.log(`Starting transition to scene: ${sceneName}`);
    }

    private switchScene(sceneName: string): void {
        if (this.currentScene) {
            this.currentScene.exit();
        }

        this.currentScene = this.scenes.get(sceneName)!;
        this.currentScene.enter();
        
        this.isTransitioning = false;
        this.nextScene = null;
        console.log(`Switched to scene: ${sceneName}`);
    }

    public update(deltaTime: number): void {
        if (this.isTransitioning) {
            this.updateTransition(deltaTime);
        }

        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }

    private updateTransition(deltaTime: number): void {
        this.transitionTime += deltaTime;
        
        if (this.transitionTime >= this.transitionDuration) {
            this.switchScene(this.nextScene!);
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        if (this.currentScene) {
            this.currentScene.render(ctx);
        }

        if (this.isTransitioning) {
            this.renderTransition(ctx);
        }
    }

    private renderTransition(ctx: CanvasRenderingContext2D): void {
        const progress = this.transitionTime / this.transitionDuration;
        const alpha = Math.sin(progress * Math.PI);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }

    public getCurrentScene(): Scene | null {
        return this.currentScene;
    }

    public getCurrentSceneName(): string | null {
        if (!this.currentScene) return null;
        
        for (const [name, scene] of this.scenes) {
            if (scene === this.currentScene) {
                return name;
            }
        }
        return null;
    }

    public isSceneActive(name: string): boolean {
        return this.currentScene === this.scenes.get(name);
    }

    public getScene(name: string): Scene | undefined {
        return this.scenes.get(name);
    }

    public getAllSceneNames(): string[] {
        return Array.from(this.scenes.keys());
    }

    public getTransitionProgress(): number {
        if (!this.isTransitioning) return 0;
        return this.transitionTime / this.transitionDuration;
    }

    public isTransitioning(): boolean {
        return this.isTransitioning;
    }

    public setTransitionDuration(duration: number): void {
        this.transitionDuration = Math.max(0, duration);
    }

    public pauseCurrentScene(): void {
        if (this.currentScene) {
            this.currentScene.pause();
        }
    }

    public resumeCurrentScene(): void {
        if (this.currentScene) {
            this.currentScene.resume();
        }
    }

    public reset(): void {
        if (this.currentScene) {
            this.currentScene.exit();
        }
        
        this.currentScene = null;
        this.nextScene = null;
        this.transitionTime = 0;
        this.isTransitioning = false;
        
        // Reset all scenes
        for (const scene of this.scenes.values()) {
            scene.reset();
        }
    }
}
