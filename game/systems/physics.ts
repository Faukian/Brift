/**
 * PhysicsSystem handles movement and physics calculations
 * Simple movement system for the demo
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { Position } from '../components/position.js';
import { Velocity } from '../components/velocity.js';

export class PhysicsSystem extends System {
    constructor(world: any) {
        super(world, ['position', 'velocity']);
    }

    public update(deltaTime: number, entities: Entity[]): void {
        // Update positions based on velocity
        for (const entity of entities) {
            const position = entity.getComponent('position') as Position;
            const velocity = entity.getComponent('velocity') as Velocity;

            if (position && velocity) {
                // Apply velocity to position
                position.x += velocity.dx * deltaTime;
                position.y += velocity.dy * deltaTime;
            }
        }
    }
}
