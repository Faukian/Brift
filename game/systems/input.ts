/**
 * InputSystem handles player input and movement
 * Uses player configuration for movement speed
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { Velocity } from '../components/velocity.js';
import { InputManager } from '../core/input.js';
import { PlayerFactory } from '../entities/player.js';

export class InputSystem extends System {
    private input: InputManager;
    private playerFactory: PlayerFactory;

    constructor(world: any, input: InputManager, playerFactory: PlayerFactory) {
        super(world, ['velocity']);
        this.input = input;
        this.playerFactory = playerFactory;
    }

    public update(deltaTime: number, entities: Entity[]): void {
        // Get player speed from configuration
        const config = this.playerFactory.getConfig();
        const playerSpeed = config?.speed ?? 200; // Fallback to default speed

        // Handle input for all entities with velocity (should be just the player)
        for (const entity of entities) {
            const velocity = entity.getComponent('velocity') as Velocity;
            
            if (velocity) {
                // Reset velocity
                velocity.dx = 0;
                velocity.dy = 0;

                // Handle arrow key input
                if (this.input.isKeyPressed('ArrowLeft') || this.input.isKeyPressed('KeyA')) {
                    velocity.dx = -playerSpeed;
                }
                if (this.input.isKeyPressed('ArrowRight') || this.input.isKeyPressed('KeyD')) {
                    velocity.dx = playerSpeed;
                }
                if (this.input.isKeyPressed('ArrowUp') || this.input.isKeyPressed('KeyW')) {
                    velocity.dy = -playerSpeed;
                }
                if (this.input.isKeyPressed('ArrowDown') || this.input.isKeyPressed('KeyS')) {
                    velocity.dy = playerSpeed;
                }
            }
        }
    }
}
