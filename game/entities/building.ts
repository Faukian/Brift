/**
 * Building entity factory for assembling building components
 * Creates building entities with all necessary components
 */

import { World } from '../core/ecs/world.js';
import { Position } from '../components/position.js';
import { Sprite } from '../components/sprite.js';
import { Health } from '../components/health.js';
import { BuildingStats } from '../components/buildingStats.js';
import { Resource } from '../components/resource.js';

export class BuildingFactory {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public createBuilding(x: number, y: number, type: string = 'basic'): number {
        const entity = this.world.createEntity();
        const entityId = entity.getId();

        // Add position component
        const position = new Position(entityId, x, y);
        this.world.addComponent(entityId, position);

        // Add sprite component
        const sprite = new Sprite(entityId, 'rectangle');
        this.world.addComponent(entityId, sprite);

        // Add health component
        const health = new Health(entityId);
        this.world.addComponent(entityId, health);

        // Add building stats component
        const buildingStats = new BuildingStats(entityId, type);
        this.world.addComponent(entityId, buildingStats);

        // Configure based on building type
        this.configureBuildingType(entityId, type);

        console.log(`Created ${type} building entity ${entityId} at (${x}, ${y})`);
        return entityId;
    }

    private configureBuildingType(entityId: number, type: string): void {
        const entity = this.world.getEntity(entityId);
        if (!entity) return;

        const sprite = entity.getComponent('sprite') as Sprite;
        const health = entity.getComponent('health') as Health;
        const buildingStats = entity.getComponent('buildingStats') as BuildingStats;

        switch (type) {
            case 'resourceGenerator':
                this.configureResourceGenerator(sprite, health, buildingStats);
                break;
            case 'storage':
                this.configureStorage(sprite, health, buildingStats);
                break;
            case 'workshop':
                this.configureWorkshop(sprite, health, buildingStats);
                break;
            case 'defense':
                this.configureDefense(sprite, health, buildingStats);
                break;
            case 'barracks':
                this.configureBarracks(sprite, health, buildingStats);
                break;
            default:
                console.log(`Unknown building type: ${type}, using basic configuration`);
                this.configureBasicBuilding(sprite, health, buildingStats);
        }
    }

    private configureBasicBuilding(sprite: Sprite, health: Health, buildingStats: BuildingStats): void {
        sprite.setRectangle(32, 32, '#808080');
        sprite.setBorder('#404040', 2);
        sprite.setLayer(6);
        
        health.setMaxHealth(100);
        health.setRegeneration(0);
        
        buildingStats.setConstructionTime(5);
        buildingStats.setConstructionSpeed(1);
        buildingStats.setPlacementRadius(40);
    }

    private configureResourceGenerator(sprite: Sprite, health: Health, buildingStats: BuildingStats): void {
        sprite.setRectangle(28, 28, '#FFD700');
        sprite.setBorder('#B8860B', 2);
        sprite.setLayer(6);
        
        health.setMaxHealth(80);
        health.setRegeneration(0);
        
        buildingStats.setConstructionTime(8);
        buildingStats.setConstructionSpeed(1);
        buildingStats.setPlacementRadius(50);
        buildingStats.setResourceGeneration('gold', 10, 2.0);
        buildingStats.setEfficiency(1.0);
    }

    private configureStorage(sprite: Sprite, health: Health, buildingStats: BuildingStats): void {
        sprite.setRectangle(36, 36, '#8B4513');
        sprite.setBorder('#654321', 2);
        sprite.setLayer(6);
        
        health.setMaxHealth(120);
        health.setRegeneration(0);
        
        buildingStats.setConstructionTime(6);
        buildingStats.setConstructionSpeed(1);
        buildingStats.setPlacementRadius(45);
        buildingStats.setStorageCapacity(100);
        buildingStats.setEfficiency(1.0);
    }

    private configureWorkshop(sprite: Sprite, health: Health, buildingStats: BuildingStats): void {
        sprite.setRectangle(30, 30, '#4682B4');
        sprite.setBorder('#2F4F4F', 2);
        sprite.setLayer(6);
        
        health.setMaxHealth(150);
        health.setRegeneration(0);
        
        buildingStats.setConstructionTime(10);
        buildingStats.setConstructionSpeed(1);
        buildingStats.setPlacementRadius(55);
        buildingStats.setWorkSpeed(1.0);
        buildingStats.setEfficiency(1.0);
    }

    private configureDefense(sprite: Sprite, health: Health, buildingStats: BuildingStats): void {
        sprite.setRectangle(26, 26, '#DC143C');
        sprite.setBorder('#8B0000', 2);
        sprite.setLayer(6);
        
        health.setMaxHealth(200);
        health.setRegeneration(0);
        
        buildingStats.setConstructionTime(12);
        buildingStats.setConstructionSpeed(1);
        buildingStats.setPlacementRadius(60);
        buildingStats.setThreatDetectionRange(120);
        buildingStats.setDefenseCooldownMax(8.0);
        buildingStats.setEfficiency(1.0);
    }

    private configureBarracks(sprite: Sprite, health: Health, buildingStats: BuildingStats): void {
        sprite.setRectangle(34, 34, '#32CD32');
        sprite.setBorder('#228B22', 2);
        sprite.setLayer(6);
        
        health.setMaxHealth(180);
        health.setRegeneration(0);
        
        buildingStats.setConstructionTime(15);
        buildingStats.setConstructionSpeed(1);
        buildingStats.setPlacementRadius(65);
        buildingStats.setEfficiency(1.0);
    }

    public createResourceNode(x: number, y: number, resourceType: string, amount: number): number {
        const entity = this.world.createEntity();
        const entityId = entity.getId();

        // Add position component
        const position = new Position(entityId, x, y);
        this.world.addComponent(entityId, position);

        // Add sprite component
        const sprite = new Sprite(entityId, 'circle');
        this.world.addComponent(entityId, sprite);

        // Add resource component
        const resource = new Resource(entityId, resourceType, amount);
        this.world.addComponent(entityId, resource);

        // Configure resource node appearance
        this.configureResourceNode(entityId, resourceType, amount);

        console.log(`Created ${resourceType} resource node entity ${entityId} at (${x}, ${y})`);
        return entityId;
    }

    private configureResourceNode(entityId: number, resourceType: string, amount: number): void {
        const entity = this.world.getEntity(entityId);
        if (!entity) return;

        const sprite = entity.getComponent('sprite') as Sprite;
        const resource = entity.getComponent('resource') as Resource;

        // Set sprite based on resource type
        const colors: { [key: string]: string } = {
            'gold': '#FFD700',
            'wood': '#8B4513',
            'stone': '#808080',
            'iron': '#696969',
            'crystal': '#00FFFF'
        };

        const color = colors[resourceType] || '#FFFFFF';
        const radius = Math.max(8, Math.min(20, 8 + amount / 10));
        
        sprite.setCircle(radius, color);
        sprite.setLayer(4);
        
        // Configure resource properties
        resource.setCollectionInterval(3.0);
        resource.setRespawnTime(60.0);
        resource.setQuality(0.8 + Math.random() * 0.4); // 0.8-1.2 quality
    }

    public upgradeBuilding(entityId: number, upgradeType: string): boolean {
        const entity = this.world.getEntity(entityId);
        if (!entity) return false;

        const buildingStats = entity.getComponent('buildingStats') as BuildingStats;
        if (!buildingStats) return false;

        switch (upgradeType) {
            case 'level':
                buildingStats.setLevel(buildingStats.level + 1);
                break;
            case 'efficiency':
                buildingStats.setEfficiency(buildingStats.efficiency + 0.2);
                break;
            case 'health':
                const health = entity.getComponent('health') as Health;
                if (health) {
                    health.setMaxHealth(health.max + 50);
                    health.healToFull();
                }
                break;
            case 'capacity':
                if (buildingStats.type === 'storage') {
                    buildingStats.setStorageCapacity((buildingStats.storageCapacity || 100) + 50);
                }
                break;
            default:
                console.log(`Unknown upgrade type: ${upgradeType}`);
                return false;
        }

        console.log(`Applied ${upgradeType} upgrade to building ${entityId}`);
        return true;
    }

    public getBuildingStats(entityId: number): any {
        const entity = this.world.getEntity(entityId);
        if (!entity) return null;

        const position = entity.getComponent('position') as Position;
        const health = entity.getComponent('health') as Health;
        const buildingStats = entity.getComponent('buildingStats') as BuildingStats;
        const resource = entity.getComponent('resource') as Resource;

        return {
            id: entityId,
            position: position ? { x: position.x, y: position.y } : null,
            health: health ? { current: health.current, max: health.max } : null,
            stats: buildingStats ? {
                type: buildingStats.type,
                level: buildingStats.level,
                isUnderConstruction: buildingStats.isUnderConstruction,
                isOperational: buildingStats.isOperational,
                efficiency: buildingStats.efficiency
            } : null,
            resource: resource ? {
                type: resource.type,
                amount: resource.amount,
                maxAmount: resource.maxAmount
            } : null
        };
    }

    public getBuildingCost(type: string): number {
        const costs: { [key: string]: number } = {
            'basic': 50,
            'resourceGenerator': 200,
            'storage': 150,
            'workshop': 300,
            'defense': 400,
            'barracks': 250
        };

        return costs[type] || 50;
    }

    public getBuildingUpgradeCost(upgradeType: string): number {
        const costs: { [key: string]: number } = {
            'level': 100,
            'efficiency': 75,
            'health': 50,
            'capacity': 80
        };

        return costs[upgradeType] || 50;
    }

    public canPlaceBuilding(x: number, y: number, buildingType: string): boolean {
        // This would check for terrain, other buildings, etc.
        // For now, just return true
        return true;
    }
}
