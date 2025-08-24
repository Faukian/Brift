/**
 * GameplayScene for the main game play state
 * Handles the core game loop and mechanics
 */

import { Scene } from './scene.js';
import { World } from '../core/ecs/world.js';
import { InputManager } from '../core/input.js';
import { Camera } from '../core/camera.js';
import { SceneManager } from './sceneManager.js';
import { RenderSystem } from '../systems/render.js';
import { PhysicsSystem } from '../systems/physics.js';
import { AISystem } from '../systems/ai.js';
import { CombatSystem } from '../systems/combat.js';
import { TowerSystem } from '../systems/tower.js';
import { BuildingSystem } from '../systems/building.js';
import { EconomySystem } from '../systems/economy.js';
import { PlayerFactory } from '../entities/player.js';
import { EnemyFactory } from '../entities/enemy.js';
import { TowerFactory } from '../entities/tower.js';
import { BuildingFactory } from '../entities/building.js';

export class GameplayScene extends Scene {
    private world: World;
    private input: InputManager;
    private camera: Camera;
    private sceneManager: SceneManager;
    private systems: any[];
    private factories: any;
    private gameState: string;
    private waveNumber: number;
    private waveTimer: number;
    private spawnPoints: { x: number; y: number }[];

    constructor(world: World, input: InputManager, camera: Camera, sceneManager: SceneManager) {
        super();
        this.world = world;
        this.input = input;
        this.camera = camera;
        this.sceneManager = sceneManager;
        this.systems = [];
        this.factories = {};
        this.gameState = 'playing';
        this.waveNumber = 1;
        this.waveTimer = 0;
        this.spawnPoints = [
            { x: 0, y: 0 },
            { x: 100, y: 0 },
            { x: 200, y: 0 },
            { x: 300, y: 0 }
        ];
    }

    protected onEnter(): void {
        // For now, just initialize basic systems to avoid errors
        this.initializeBasicSystems();
        console.log('Gameplay scene entered');
    }

    protected onExit(): void {
        this.cleanup();
        console.log('Gameplay scene exited');
    }

    protected onPause(): void {
        this.gameState = 'paused';
        console.log('Gameplay scene paused');
    }

    protected onResume(): void {
        this.gameState = 'playing';
        console.log('Gameplay scene resumed');
    }

    protected onUpdate(deltaTime: number): void {
        if (this.gameState !== 'playing') return;

        // Update camera
        this.camera.update(deltaTime);

        // Update world (ECS systems) if any exist
        if (this.systems.length > 0) {
            this.world.update(deltaTime);
        }

        // Update wave system
        this.updateWaveSystem(deltaTime);

        // Handle input
        this.handleInput();

        // Check game over conditions
        this.checkGameOver();
    }

    protected onRender(ctx: CanvasRenderingContext2D): void {
        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Render world entities if systems exist
        if (this.systems.length > 0) {
            this.renderWorld(ctx);
        } else {
            // Render a simple gameplay placeholder
            this.renderPlaceholder(ctx);
        }

        // Render UI overlay
        this.renderUI(ctx);
    }

    protected onReset(): void {
        this.cleanup();
        this.gameState = 'playing';
        this.waveNumber = 1;
        this.waveTimer = 0;
        console.log('Gameplay scene reset');
    }

    private initializeBasicSystems(): void {
        // Create and add basic systems only
        const renderSystem = new RenderSystem(this.world);
        const physicsSystem = new PhysicsSystem(this.world);

        this.systems = [
            renderSystem,
            physicsSystem
        ];

        // Add systems to world
        for (const system of this.systems) {
            this.world.addSystem(system);
        }

        console.log(`Initialized ${this.systems.length} basic game systems`);
    }

    private initializeSystems(): void {
        // Create and add all game systems
        const renderSystem = new RenderSystem(this.world, this.camera, this.getCanvasContext());
        const physicsSystem = new PhysicsSystem(this.world);
        const aiSystem = new AISystem(this.world);
        const combatSystem = new CombatSystem(this.world);
        const towerSystem = new TowerSystem(this.world);
        const buildingSystem = new BuildingSystem(this.world);
        const economySystem = new EconomySystem(this.world);

        this.systems = [];
        // Temporarily disable complex systems to avoid errors
        // this.systems = [
        //     renderSystem,
        //     physicsSystem,
        //     aiSystem,
        //     combatSystem,
        //     towerSystem,
        //     buildingSystem,
        //     economySystem
        // ];

        // Add systems to world
        for (const system of this.systems) {
            this.world.addSystem(system);
        }

        console.log(`Initialized ${this.systems.length} game systems`);
    }

    private initializeFactories(): void {
        this.factories = {
            player: new PlayerFactory(this.world),
            enemy: new EnemyFactory(this.world),
            tower: new TowerFactory(this.world),
            building: new BuildingFactory(this.world)
        };
        console.log('Initialized entity factories');
    }

    private createPlayer(): void {
        const playerId = this.factories.player.createPlayer(640, 360);
        console.log(`Created player with ID: ${playerId}`);
    }

    private createInitialEnemies(): void {
        // Create some initial enemies for testing
        for (let i = 0; i < 3; i++) {
            const x = Math.random() * 1280;
            const y = Math.random() * 720;
            const enemyId = this.factories.enemy.createEnemy(x, y, 'grunt');
            console.log(`Created enemy with ID: ${enemyId}`);
        }
    }

    private createResourceNodes(): void {
        // Create resource nodes around the map
        const resourceTypes = ['gold', 'wood', 'stone'];
        for (let i = 0; i < 5; i++) {
            const x = 100 + Math.random() * 1080;
            const y = 100 + Math.random() * 520;
            const resourceType = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
            const amount = 20 + Math.random() * 30;
            const resourceId = this.factories.building.createResourceNode(x, y, resourceType, amount);
            console.log(`Created ${resourceType} resource node with ID: ${resourceId}`);
        }
    }

    private updateWaveSystem(deltaTime: number): void {
        this.waveTimer += deltaTime;

        // Spawn new wave every 30 seconds
        if (this.waveTimer >= 30000) {
            this.spawnWave();
            this.waveTimer = 0;
        }
    }

    private spawnWave(): void {
        this.waveNumber++;
        const enemyIds = this.factories.enemy.createEnemyWave(this.waveNumber, this.spawnPoints);
        console.log(`Spawned wave ${this.waveNumber} with ${enemyIds.length} enemies`);
    }

    private handleInput(): void {
        // Handle keyboard input
        if (this.input.isKeyPressed('KeyW')) {
            this.camera.pan(0, -10);
        }
        if (this.input.isKeyPressed('KeyS')) {
            this.camera.pan(0, 10);
        }
        if (this.input.isKeyPressed('KeyA')) {
            this.camera.pan(-10, 0);
        }
        if (this.input.isKeyPressed('KeyD')) {
            this.camera.pan(10, 0);
        }

        // Handle mouse input
        if (this.input.isMouseButtonPressed(0)) { // Left click
            const mousePos = this.input.getMousePosition();
            this.handleMouseClick(mousePos.x, mousePos.y);
        }

        // Handle pause/return to menu
        if (this.input.isKeyJustPressed('Escape')) {
            // Return to menu instead of just pausing
            this.sceneManager.setScene('menu', false);
        }
    }

    private handleMouseClick(x: number, y: number): void {
        // Convert screen coordinates to world coordinates
        const worldPos = this.camera.screenToWorld(x, y);
        
        // Check if clicking on UI elements first
        if (this.isClickingUI(x, y)) {
            return;
        }

        // Handle world interaction
        this.handleWorldClick(worldPos.x, worldPos.y);
    }

    private isClickingUI(x: number, y: number): boolean {
        // Check if click is within UI bounds
        // This would check against UI element bounds
        return false;
    }

    private handleWorldClick(worldX: number, worldY: number): void {
        // Check if clicking on entities
        const entities = this.world.getEntitiesWithComponents(['position']);
        for (const entity of entities) {
            const position = entity.getComponent('position');
            if (position) {
                const distance = Math.sqrt(
                    Math.pow(worldX - position.x, 2) + 
                    Math.pow(worldY - position.y, 2)
                );
                
                if (distance < 20) { // Click radius
                    this.selectEntity(entity);
                    return;
                }
            }
        }

        // If no entity clicked, try to place tower or building
        this.tryPlaceStructure(worldX, worldY);
    }

    private selectEntity(entity: any): void {
        console.log(`Selected entity: ${entity.getId()}`);
        // This would highlight the entity and show its stats
    }

    private tryPlaceStructure(x: number, y: number): void {
        // Check if player has enough resources and try to place structure
        // This would be implemented based on current selection mode
        console.log(`Attempting to place structure at (${x}, ${y})`);
    }

    private togglePause(): void {
        if (this.gameState === 'playing') {
            this.pause();
        } else if (this.gameState === 'paused') {
            this.resume();
        }
    }

    private renderWorld(ctx: CanvasRenderingContext2D): void {
        // The world rendering is handled by the RenderSystem
        // This method could add additional world rendering if needed
    }

    private renderPlaceholder(ctx: CanvasRenderingContext2D): void {
        // Render a simple gameplay placeholder
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Gameplay Scene', ctx.canvas.width / 2, ctx.canvas.height / 3);
        
        ctx.font = '24px Arial';
        ctx.fillText('Press ESC to return to menu', ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.fillText('This is a placeholder for the actual gameplay', ctx.canvas.width / 2, ctx.canvas.height / 2 + 40);
    }

    private renderUI(ctx: CanvasRenderingContext2D): void {
        // Render HUD elements
        this.renderHUD(ctx);
        
        // Render pause overlay if paused
        if (this.gameState === 'paused') {
            this.renderPauseOverlay(ctx);
        }
    }

    private renderHUD(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // Render wave info
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Wave: ${this.waveNumber}`, 20, 40);
        
        // Render timer
        const timeRemaining = Math.max(0, 30 - this.waveTimer / 1000);
        ctx.fillText(`Next Wave: ${timeRemaining.toFixed(1)}s`, 20, 70);
        
        // Render entity count
        const entityCount = this.world.getEntityCount();
        ctx.fillText(`Entities: ${entityCount}`, 20, 100);
        
        ctx.restore();
    }

    private renderPauseOverlay(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Pause text
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', ctx.canvas.width / 2, ctx.canvas.height / 2);
        
        ctx.font = '24px Arial';
        ctx.fillText('Press ESC to resume', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
        
        ctx.restore();
    }

    private checkGameOver(): void {
        // Check if player is dead
        const players = this.world.getEntitiesWithComponents(['health']);
        if (players.length === 0) {
            this.gameState = 'gameOver';
            console.log('Game Over - No players remaining');
            return;
        }

        // Check if player health is 0
        for (const player of players) {
            const health = player.getComponent('health');
            if (health && health.current <= 0) {
                this.gameState = 'gameOver';
                console.log('Game Over - Player health depleted');
                return;
            }
        }
    }

    private getCanvasContext(): CanvasRenderingContext2D {
        const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
        return canvas.getContext('2d')!;
    }

    private cleanup(): void {
        // Remove all systems from world
        for (const system of this.systems) {
            this.world.removeSystem(system);
        }
        
        this.systems = [];
        console.log('Cleaned up gameplay scene');
    }

    public getGameState(): string {
        return this.gameState;
    }

    public getWaveNumber(): number {
        return this.waveNumber;
    }

    public getWaveTimer(): number {
        return this.waveTimer;
    }

    // Mouse input handling methods for the main game loop
    public handleMouseMove(mouseX: number, mouseY: number): void {
        // Handle mouse movement in gameplay (could be used for camera panning, etc.)
    }

    public handleMouseDown(mouseX: number, mouseY: number): void {
        // Handle mouse down in gameplay (could be used for building placement, etc.)
    }

    public handleMouseUp(mouseX: number, mouseY: number): void {
        // Handle mouse up in gameplay (could be used for building placement, etc.)
    }
}
