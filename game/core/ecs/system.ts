/**
 * Base System class for processing entities with specific component combinations
 * Systems contain the game logic and operate on entities that have required components
 */

import { Entity } from './entity.js';
import { World } from './world.js';

export abstract class System {
    protected world: World;
    protected requiredComponents: string[];

    constructor(world: World, requiredComponents: string[]) {
        this.world = world;
        this.requiredComponents = requiredComponents;
    }

    public getRequiredComponents(): string[] {
        return this.requiredComponents;
    }

    public canProcess(entity: Entity): boolean {
        return this.requiredComponents.every(componentType => 
            entity.hasComponent(componentType)
        );
    }

    // Abstract method that systems must implement
    public abstract update(deltaTime: number, entities: Entity[]): void;

    // Optional render method for rendering systems
    public render?(ctx: CanvasRenderingContext2D, entities: Entity[]): void;
}
