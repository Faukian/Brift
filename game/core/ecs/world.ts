/**
 * World class manages all entities, components, and systems
 * Central hub for the Entity-Component-System architecture
 */

import { Entity } from './entity.js';
import { Component } from './component.js';
import { System } from './system.js';

export class World {
    private entities: Map<number, Entity>;
    private systems: System[];
    private nextEntityId: number;

    constructor() {
        this.entities = new Map();
        this.systems = [];
        this.nextEntityId = 0;
    }

    public createEntity(): Entity {
        const entity = new Entity(this.nextEntityId++);
        this.entities.set(entity.getId(), entity);
        return entity;
    }

    public addComponent(entityId: number, component: Component): void {
        const entity = this.entities.get(entityId);
        if (entity) {
            entity.addComponent(component);
        }
    }

    public getEntity(entityId: number): Entity | undefined {
        return this.entities.get(entityId);
    }

    public getEntitiesWithComponents(componentTypes: string[]): Entity[] {
        const result: Entity[] = [];
        
        for (const entity of this.entities.values()) {
            if (entity.isEntityActive() && 
                componentTypes.every(type => entity.hasComponent(type))) {
                result.push(entity);
            }
        }
        
        return result;
    }

    public addSystem(system: System): void {
        this.systems.push(system);
    }

    public update(deltaTime: number): void {
        // Update all systems
        for (const system of this.systems) {
            const entities = this.getEntitiesWithComponents(system.getRequiredComponents());
            system.update(deltaTime, entities);
        }
    }

    public render(ctx: CanvasRenderingContext2D): void {
        // Render all systems that have render methods
        for (const system of this.systems) {
            if (system.render) {
                const entities = this.getEntitiesWithComponents(system.getRequiredComponents());
                system.render(ctx, entities);
            }
        }
    }

    public getEntityCount(): number {
        return this.entities.size;
    }

    public getSystemCount(): number {
        return this.systems.length;
    }
}
