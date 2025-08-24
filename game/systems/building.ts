/**
 * BuildingSystem handles building placement, construction, and building-specific logic
 * Manages building construction, upgrades, and resource generation
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { World } from '../core/ecs/world.js';
import { MathUtils } from '../core/utils.js';

export class BuildingSystem extends System {
    constructor(world: World) {
        super(world, ['buildingStats', 'position'], 25); // Lower priority
    }

    public update(deltaTime: number, entities: Entity[]): void {
        const deltaSeconds = deltaTime / 1000;

        for (const entity of entities) {
            this.updateBuilding(entity, deltaSeconds);
        }
    }

    private updateBuilding(entity: Entity, deltaSeconds: number): void {
        const buildingStats = entity.getComponent('buildingStats');
        const position = entity.getComponent('position');
        
        if (!buildingStats || !position) return;

        // Update construction progress
        if (buildingStats.isUnderConstruction) {
            this.updateConstruction(entity, buildingStats, deltaSeconds);
        }

        // Update building operation
        if (buildingStats.isOperational) {
            this.updateOperation(entity, buildingStats, deltaSeconds);
        }

        // Update building health and maintenance
        this.updateMaintenance(entity, buildingStats, deltaSeconds);
    }

    private updateConstruction(entity: Entity, buildingStats: any, deltaSeconds: number): void {
        // Progress construction
        buildingStats.constructionProgress += buildingStats.constructionSpeed * deltaSeconds;

        // Check if construction is complete
        if (buildingStats.constructionProgress >= buildingStats.constructionTime) {
            this.completeConstruction(entity, buildingStats);
        }

        // Update visual representation during construction
        this.updateConstructionVisual(entity, buildingStats);
    }

    private completeConstruction(entity: Entity, buildingStats: any): void {
        buildingStats.isUnderConstruction = false;
        buildingStats.isOperational = true;
        buildingStats.constructionProgress = buildingStats.constructionTime;

        // Trigger construction complete effects
        this.triggerConstructionComplete(entity, buildingStats);

        // Initialize building operation
        this.initializeBuildingOperation(entity, buildingStats);
    }

    private triggerConstructionComplete(entity: Entity, buildingStats: any): void {
        // This would trigger visual effects, sounds, etc.
        console.log(`Building ${entity.getId()} construction completed`);
    }

    private initializeBuildingOperation(entity: Entity, buildingStats: any): void {
        // Initialize building-specific systems
        switch (buildingStats.type) {
            case 'resourceGenerator':
                this.initializeResourceGenerator(entity, buildingStats);
                break;
            case 'storage':
                this.initializeStorage(entity, buildingStats);
                break;
            case 'workshop':
                this.initializeWorkshop(entity, buildingStats);
                break;
            case 'defense':
                this.initializeDefense(entity, buildingStats);
                break;
            default:
                console.log(`Unknown building type: ${buildingStats.type}`);
        }
    }

    private initializeResourceGenerator(entity: Entity, buildingStats: any): void {
        // Initialize resource generation
        buildingStats.lastResourceGeneration = 0;
        buildingStats.resourceGenerationTimer = 0;
        
        console.log(`Resource generator ${entity.getId()} initialized`);
    }

    private initializeStorage(entity: Entity, buildingStats: any): void {
        // Initialize storage capacity
        buildingStats.currentStorage = 0;
        buildingStats.storageItems = [];
        
        console.log(`Storage building ${entity.getId()} initialized`);
    }

    private initializeWorkshop(entity: Entity, buildingStats: any): void {
        // Initialize workshop capabilities
        buildingStats.currentProject = null;
        buildingStats.projectProgress = 0;
        
        console.log(`Workshop ${entity.getId()} initialized`);
    }

    private initializeDefense(entity: Entity, buildingStats: any): void {
        // Initialize defensive capabilities
        buildingStats.defenseActive = true;
        buildingStats.defenseCooldown = 0;
        
        console.log(`Defense building ${entity.getId()} initialized`);
    }

    private updateOperation(entity: Entity, buildingStats: any, deltaSeconds: number): void {
        switch (buildingStats.type) {
            case 'resourceGenerator':
                this.updateResourceGenerator(entity, buildingStats, deltaSeconds);
                break;
            case 'storage':
                this.updateStorage(entity, buildingStats, deltaSeconds);
                break;
            case 'workshop':
                this.updateWorkshop(entity, buildingStats, deltaSeconds);
                break;
            case 'defense':
                this.updateDefense(entity, buildingStats, deltaSeconds);
                break;
        }
    }

    private updateResourceGenerator(entity: Entity, buildingStats: any, deltaSeconds: number): void {
        buildingStats.resourceGenerationTimer += deltaSeconds;

        if (buildingStats.resourceGenerationTimer >= buildingStats.resourceGenerationInterval) {
            this.generateResource(entity, buildingStats);
            buildingStats.resourceGenerationTimer = 0;
        }
    }

    private generateResource(entity: Entity, buildingStats: any): void {
        // Generate resources based on building type and level
        const resourceType = buildingStats.resourceType;
        const amount = buildingStats.resourceGenerationAmount * (buildingStats.level || 1);

        // This would add resources to the player's inventory
        console.log(`Generated ${amount} ${resourceType} from building ${entity.getId()}`);
    }

    private updateStorage(entity: Entity, buildingStats: any, deltaSeconds: number): void {
        // Update storage operations
        // This could include item sorting, capacity management, etc.
    }

    private updateWorkshop(entity: Entity, buildingStats: any, deltaSeconds: number): void {
        if (buildingStats.currentProject) {
            buildingStats.projectProgress += buildingStats.workSpeed * deltaSeconds;

            if (buildingStats.projectProgress >= buildingStats.currentProject.timeRequired) {
                this.completeProject(entity, buildingStats);
            }
        }
    }

    private completeProject(entity: Entity, buildingStats: any): void {
        const project = buildingStats.currentProject;
        buildingStats.currentProject = null;
        buildingStats.projectProgress = 0;

        // This would complete the project and give rewards
        console.log(`Project completed in workshop ${entity.getId()}`);
    }

    private updateDefense(entity: Entity, buildingStats: any, deltaSeconds: number): void {
        if (buildingStats.defenseCooldown > 0) {
            buildingStats.defenseCooldown -= deltaSeconds;
        }

        // Check for nearby threats and activate defense if needed
        if (buildingStats.defenseActive && buildingStats.defenseCooldown <= 0) {
            this.checkForThreats(entity, buildingStats);
        }
    }

    private checkForThreats(entity: Entity, buildingStats: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        // Find nearby enemies
        const nearbyEnemies = this.world.getEntitiesWithComponents(['health', 'position', 'enemy']);
        
        for (const enemy of nearbyEnemies) {
            const enemyPos = enemy.getComponent('position');
            if (!enemyPos) continue;

            const distance = MathUtils.distance(position.x, position.y, enemyPos.x, enemyPos.y);
            if (distance <= buildingStats.threatDetectionRange) {
                this.activateDefense(entity, buildingStats, enemy);
                break;
            }
        }
    }

    private activateDefense(entity: Entity, buildingStats: any, target: Entity): void {
        // Activate defensive measures
        buildingStats.defenseCooldown = buildingStats.defenseCooldownMax || 5.0;

        // This would trigger defensive actions (shields, traps, etc.)
        console.log(`Defense building ${entity.getId()} activated against enemy ${target.getId()}`);
    }

    private updateMaintenance(entity: Entity, buildingStats: any, deltaSeconds: number): void {
        // Update building health and maintenance
        if (buildingStats.health && buildingStats.health.current < buildingStats.health.max) {
            if (buildingStats.autoRepair) {
                buildingStats.health.current += buildingStats.repairRate * deltaSeconds;
                buildingStats.health.current = Math.min(buildingStats.health.current, buildingStats.health.max);
            }
        }

        // Check for building destruction
        if (buildingStats.health && buildingStats.health.current <= 0) {
            this.destroyBuilding(entity, buildingStats);
        }
    }

    private destroyBuilding(entity: Entity, buildingStats: any): void {
        // Trigger destruction effects
        this.triggerBuildingDestruction(entity, buildingStats);

        // Schedule entity removal
        setTimeout(() => {
            this.world.removeEntity(entity.getId());
        }, 2000); // 2 second delay for destruction animation
    }

    private triggerBuildingDestruction(entity: Entity, buildingStats: any): void {
        // This would trigger destruction effects, sounds, etc.
        console.log(`Building ${entity.getId()} destroyed`);
    }

    private updateConstructionVisual(entity: Entity, buildingStats: any): void {
        // Update visual representation during construction
        // This could modify the sprite component to show construction progress
        const sprite = entity.getComponent('sprite');
        if (sprite) {
            const progress = buildingStats.constructionProgress / buildingStats.constructionTime;
            sprite.alpha = 0.5 + progress * 0.5; // Fade in as construction progresses
        }
    }

    public canPlaceBuilding(x: number, y: number, buildingType: string): boolean {
        // Check if location is valid for building placement
        // This would check for terrain, other buildings, etc.
        
        // For now, just check if position is within bounds
        if (x < 0 || y < 0 || x > 2000 || y > 2000) {
            return false;
        }

        // Check for collision with existing buildings
        const existingBuildings = this.world.getEntitiesWithComponents(['buildingStats', 'position']);
        
        for (const building of existingBuildings) {
            const buildingPos = building.getComponent('position');
            const buildingStats = building.getComponent('buildingStats');
            
            if (!buildingPos || !buildingStats) continue;

            const distance = MathUtils.distance(x, y, buildingPos.x, buildingPos.y);
            const minDistance = buildingStats.placementRadius || 50;
            
            if (distance < minDistance) {
                return false;
            }
        }

        return true;
    }

    public placeBuilding(x: number, y: number, buildingType: string): Entity | null {
        if (!this.canPlaceBuilding(x, y, buildingType)) {
            return null;
        }

        // Create building entity
        const building = this.world.createEntity();
        
        // Add building components (this would use entity factories)
        // For now, just log the placement
        console.log(`Placed ${buildingType} at (${x}, ${y})`);

        return building;
    }

    public upgradeBuilding(entity: Entity, upgradeType: string): boolean {
        const buildingStats = entity.getComponent('buildingStats');
        if (!buildingStats) return false;

        // Check if upgrade is available and affordable
        if (!buildingStats.upgrades || !buildingStats.upgrades[upgradeType]) {
            return false;
        }

        const upgrade = buildingStats.upgrades[upgradeType];
        
        // Apply upgrade effects
        if (upgrade.level) buildingStats.level = (buildingStats.level || 1) + upgrade.level;
        if (upgrade.health) buildingStats.health.max += upgrade.health;
        if (upgrade.efficiency) buildingStats.efficiency = (buildingStats.efficiency || 1.0) + upgrade.efficiency;

        // Mark upgrade as applied
        buildingStats.appliedUpgrades = buildingStats.appliedUpgrades || [];
        buildingStats.appliedUpgrades.push(upgradeType);

        console.log(`Building ${entity.getId()} upgraded with ${upgradeType}`);
        return true;
    }
}
