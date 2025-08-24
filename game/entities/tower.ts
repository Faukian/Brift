/**
 * Tower entity factory for assembling tower components
 * Creates tower entities with all necessary components
 */

import { World } from '../core/ecs/world.js';
import { Position } from '../components/position.js';
import { Sprite } from '../components/sprite.js';
import { Health } from '../components/health.js';
import { TowerStats } from '../components/towerStats.js';

export class TowerFactory {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public createTower(x: number, y: number, type: string = 'basic'): number {
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

        // Add tower stats component
        const towerStats = new TowerStats(entityId, type);
        this.world.addComponent(entityId, towerStats);

        // Configure based on tower type
        this.configureTowerType(entityId, type);

        console.log(`Created ${type} tower entity ${entityId} at (${x}, ${y})`);
        return entityId;
    }

    private configureTowerType(entityId: number, type: string): void {
        const entity = this.world.getEntity(entityId);
        if (!entity) return;

        const sprite = entity.getComponent('sprite') as Sprite;
        const health = entity.getComponent('health') as Health;
        const towerStats = entity.getComponent('towerStats') as TowerStats;

        switch (type) {
            case 'basic':
                this.configureBasicTower(sprite, health, towerStats);
                break;
            case 'rapid':
                this.configureRapidTower(sprite, health, towerStats);
                break;
            case 'sniper':
                this.configureSniperTower(sprite, health, towerStats);
                break;
            case 'splash':
                this.configureSplashTower(sprite, health, towerStats);
                break;
            case 'support':
                this.configureSupportTower(sprite, health, towerStats);
                break;
            default:
                console.log(`Unknown tower type: ${type}, using basic configuration`);
                this.configureBasicTower(sprite, health, towerStats);
        }
    }

    private configureBasicTower(sprite: Sprite, health: Health, towerStats: TowerStats): void {
        sprite.setRectangle(24, 24, '#4169E1');
        sprite.setBorder('#000080', 2);
        sprite.setLayer(7);
        
        health.setMaxHealth(150);
        health.setRegeneration(0);
        
        towerStats.setDamage(25);
        towerStats.setRange(120);
        towerStats.setAttackRate(1.0);
        towerStats.setProjectileType('arrow', 250);
        towerStats.setTargetingPreferences(false, false, false, false);
    }

    private configureRapidTower(sprite: Sprite, health: Health, towerStats: TowerStats): void {
        sprite.setRectangle(20, 20, '#FF6347');
        sprite.setBorder('#8B0000', 2);
        sprite.setLayer(7);
        
        health.setMaxHealth(100);
        health.setRegeneration(0);
        
        towerStats.setDamage(15);
        towerStats.setRange(100);
        towerStats.setAttackRate(0.3);
        towerStats.setProjectileType('bullet', 400);
        towerStats.setTargetingPreferences(false, false, false, false);
    }

    private configureSniperTower(sprite: Sprite, health: Health, towerStats: TowerStats): void {
        sprite.setRectangle(28, 28, '#2F4F4F');
        sprite.setBorder('#000000', 2);
        sprite.setLayer(7);
        
        health.setMaxHealth(200);
        health.setRegeneration(0);
        
        towerStats.setDamage(80);
        towerStats.setRange(300);
        towerStats.setAttackRate(2.0);
        towerStats.setProjectileType('bullet', 600);
        towerStats.setTargetingPreferences(false, false, true, true);
        towerStats.setSpecialAbility('stun', 5.0, 0, 300);
    }

    private configureSplashTower(sprite: Sprite, health: Health, towerStats: TowerStats): void {
        sprite.setRectangle(32, 32, '#FF4500');
        sprite.setBorder('#8B0000', 2);
        sprite.setLayer(7);
        
        health.setMaxHealth(180);
        health.setRegeneration(0);
        
        towerStats.setDamage(40);
        towerStats.setRange(80);
        towerStats.setAttackRate(1.5);
        towerStats.setProjectileType('fireball', 150);
        towerStats.setSpecialAbility('areaDamage', 8.0, 30, 80);
        towerStats.setTargetingPreferences(true, false, false, false);
    }

    private configureSupportTower(sprite: Sprite, health: Health, towerStats: TowerStats): void {
        sprite.setRectangle(22, 22, '#32CD32');
        sprite.setBorder('#006400', 2);
        sprite.setLayer(7);
        
        health.setMaxHealth(120);
        health.setRegeneration(0);
        
        towerStats.setDamage(0);
        towerStats.setRange(150);
        towerStats.setAttackRate(0);
        towerStats.setSpecialAbility('slow', 3.0, 0, 150);
        towerStats.setTargetingPreferences(false, false, false, false);
    }

    public upgradeTower(entityId: number, upgradeType: string): boolean {
        const entity = this.world.getEntity(entityId);
        if (!entity) return false;

        const towerStats = entity.getComponent('towerStats') as TowerStats;
        if (!towerStats) return false;

        switch (upgradeType) {
            case 'damage':
                towerStats.setDamage(towerStats.damage + 10);
                break;
            case 'range':
                towerStats.setRange(towerStats.range + 30);
                break;
            case 'speed':
                towerStats.setAttackRate(Math.max(0.1, towerStats.attackRate - 0.2));
                break;
            case 'special':
                this.upgradeSpecialAbility(towerStats);
                break;
            default:
                console.log(`Unknown upgrade type: ${upgradeType}`);
                return false;
        }

        console.log(`Applied ${upgradeType} upgrade to tower ${entityId}`);
        return true;
    }

    private upgradeSpecialAbility(towerStats: TowerStats): void {
        if (towerStats.specialAbility === 'areaDamage') {
            towerStats.specialDamage = (towerStats.specialDamage || 0) + 10;
        } else if (towerStats.specialAbility === 'slow') {
            towerStats.specialRange = (towerStats.specialRange || 0) + 20;
        } else if (towerStats.specialAbility === 'stun') {
            towerStats.specialCooldownMax = Math.max(1.0, towerStats.specialCooldownMax - 0.5);
        }
    }

    public getTowerStats(entityId: number): any {
        const entity = this.world.getEntity(entityId);
        if (!entity) return null;

        const position = entity.getComponent('position') as Position;
        const health = entity.getComponent('health') as Health;
        const towerStats = entity.getComponent('towerStats') as TowerStats;

        return {
            id: entityId,
            position: position ? { x: position.x, y: position.y } : null,
            health: health ? { current: health.current, max: health.max } : null,
            stats: towerStats ? {
                type: towerStats.type,
                level: towerStats.level,
                damage: towerStats.damage,
                range: towerStats.range,
                attackRate: towerStats.attackRate,
                specialAbility: towerStats.specialAbility
            } : null
        };
    }

    public createTowerWithUpgrades(x: number, y: number, type: string, upgrades: string[]): number {
        const entityId = this.createTower(x, y, type);
        
        for (const upgrade of upgrades) {
            this.upgradeTower(entityId, upgrade);
        }

        return entityId;
    }

    public getTowerCost(type: string): number {
        const costs: { [key: string]: number } = {
            'basic': 100,
            'rapid': 150,
            'sniper': 200,
            'splash': 250,
            'support': 180
        };

        return costs[type] || 100;
    }

    public getTowerUpgradeCost(upgradeType: string): number {
        const costs: { [key: string]: number } = {
            'damage': 50,
            'range': 75,
            'speed': 100,
            'special': 150
        };

        return costs[upgradeType] || 50;
    }
}
