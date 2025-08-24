/**
 * Entity class for managing entity IDs and component associations
 * Each entity has a unique ID and can have multiple components attached
 */

import { Component } from './component.js';

export class Entity {
    private id: number;
    private type: string;
    private components: Map<string, Component>;
    private isActive: boolean;

    constructor(id: number, type: string = 'entity') {
        this.id = id;
        this.type = type;
        this.components = new Map();
        this.isActive = true;
    }

    public getId(): number {
        return this.id;
    }

    public addComponent(component: Component): void {
        this.components.set(component.getType(), component);
    }

    public removeComponent(componentType: string): void {
        this.components.delete(componentType);
    }

    public getComponent<T extends Component>(componentType: string): T | undefined {
        return this.components.get(componentType) as T;
    }

    public hasComponent(componentType: string): boolean {
        return this.components.has(componentType);
    }

    public getAllComponents(): Component[] {
        return Array.from(this.components.values());
    }

    public isEntityActive(): boolean {
        return this.isActive;
    }

    public setActive(active: boolean): void {
        this.isActive = active;
    }

    public destroy(): void {
        this.isActive = false;
        this.components.clear();
    }

    public getType(): string {
        return this.type;
    }
}
