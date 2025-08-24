/**
 * Player entity factory for assembling player components
 * Uses JSON configuration for data-driven entity creation
 */

import { World } from '../core/ecs/world.js';
import { Position } from '../components/position.js';
import { Velocity } from '../components/velocity.js';
import { Sprite } from '../components/sprite.js';
import { DataUtils } from '../core/utils.js';

export interface PlayerConfig {
    speed: number;
    width: number;
    height: number;
    color: string;
    name: string;
    description: string;
}

export class PlayerFactory {
    private world: World;
    private config: PlayerConfig | null = null;

    constructor(world: World) {
        this.world = world;
    }

    /**
     * Load player configuration from JSON file
     */
    public async loadConfig(): Promise<void> {
        try {
            this.config = await DataUtils.loadJSON<PlayerConfig>('data/player.json');
            console.log('Player configuration loaded:', this.config);
        } catch (error) {
            console.error('Failed to load player config, using defaults:', error);
            this.config = {
                speed: 200,
                width: 32,
                height: 32,
                color: '#00ff00',
                name: 'Player',
                description: 'Main player character'
            };
        }
    }

    /**
     * Create player entity using loaded configuration
     */
    public createPlayer(x: number = 640, y: number = 360): number {
        if (!this.config) {
            throw new Error('Player configuration not loaded. Call loadConfig() first.');
        }

        const entity = this.world.createEntity('player');
        const entityId = entity.getId();

        // Add position component
        const position = new Position(entityId, x, y);
        this.world.addComponent(entityId, position);

        // Add velocity component (speed will be set by InputSystem)
        const velocity = new Velocity(entityId);
        this.world.addComponent(entityId, velocity);

        // Add sprite component using config values
        const sprite = new Sprite(entityId, this.config.color, this.config.width, this.config.height);
        this.world.addComponent(entityId, sprite);

        console.log(`Created player entity ${entityId} at (${x}, ${y}) with config:`, this.config);
        return entityId;
    }

    /**
     * Get the current player configuration
     */
    public getConfig(): PlayerConfig | null {
        return this.config;
    }
}
