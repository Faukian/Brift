/**
 * RenderSystem draws entities with Position and Sprite components
 * Simple rendering system for the demo
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { Position } from '../components/position.js';
import { Sprite } from '../components/sprite.js';

export class RenderSystem extends System {
    constructor(world: any) {
        super(world, ['position', 'sprite']);
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
            }
        }
    }
}
