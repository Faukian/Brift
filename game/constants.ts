/**
 * Global game constants, enums, and configuration values
 */

// Screen and rendering constants
export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 720;
export const TILE_SIZE = 32;
export const GRID_WIDTH = Math.floor(CANVAS_WIDTH / TILE_SIZE);
export const GRID_HEIGHT = Math.floor(CANVAS_HEIGHT / TILE_SIZE);

// Game settings
export const FPS = 60;
export const TARGET_FRAME_TIME = 1000 / FPS;

// Entity types
export enum EntityType {
    PLAYER = 'player',
    ENEMY = 'enemy',
    TOWER = 'tower',
    PROJECTILE = 'projectile',
    BUILDING = 'building',
    RESOURCE = 'resource'
}

// Component types
export enum ComponentType {
    POSITION = 'position',
    VELOCITY = 'velocity',
    SPRITE = 'sprite',
    HEALTH = 'health',
    DAMAGE = 'damage',
    TOWER_STATS = 'towerStats',
    BUILDING_STATS = 'buildingStats',
    RESOURCE = 'resource',
    AI_BEHAVIOR = 'aiBehavior'
}

// Game states
export enum GameState {
    MENU = 'menu',
    PLAYING = 'playing',
    PAUSED = 'paused',
    GAME_OVER = 'gameOver'
}

// Direction constants
export enum Direction {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
}

// Resource types
export enum ResourceType {
    GOLD = 'gold',
    WOOD = 'wood',
    STONE = 'stone',
    EXPERIENCE = 'experience'
}

// Tower types
export enum TowerType {
    BASIC = 'basic',
    RAPID = 'rapid',
    SNIPER = 'sniper',
    SPLASH = 'splash'
}

// Enemy types
export enum EnemyType {
    GRUNT = 'grunt',
    FAST = 'fast',
    TANK = 'tank',
    BOSS = 'boss'
}
