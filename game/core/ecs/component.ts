/**
 * Base Component class for the ECS architecture
 * All game components inherit from this base class
 */

export abstract class Component {
    protected type: string;
    protected entityId: number;

    constructor(type: string, entityId: number) {
        this.type = type;
        this.entityId = entityId;
    }

    public getType(): string {
        return this.type;
    }

    public getEntityId(): number {
        return this.entityId;
    }

    public setEntityId(entityId: number): void {
        this.entityId = entityId;
    }

    // Abstract method that components must implement for serialization
    public abstract clone(): Component;
}
