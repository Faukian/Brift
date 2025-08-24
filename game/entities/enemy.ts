/**
 * Enemy entity factory for assembling enemy components
 * Creates enemy entities with all necessary components
 */

import { World } from '../core/ecs/world.js';
import { Position } from '../components/position.js';
import { Velocity } from '../components/velocity.js';
import { Sprite } from '../components/sprite.js';
import { Health } from '../components/health.js';
import { Damage } from '../components/damage.js';
import { AIBehavior } from '../components/aiBehavior.js';

export class EnemyFactory {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public createEnemy(x: number, y: number, type: string = 'grunt'): number {
        const entity = this.world.createEntity();
        const entityId = entity.getId();

        // Add position component
        const position = new Position(entityId, x, y);
        this.world.addComponent(entityId, position);

        // Add velocity component
        const velocity = new Velocity(entityId);
        this.world.addComponent(entityId, velocity);

        // Add sprite component
        const sprite = new Sprite(entityId, 'circle');
        this.world.addComponent(entityId, sprite);

        // Add health component
        const health = new Health(entityId);
        this.world.addComponent(entityId, health);

        // Add damage component
        const damage = new Damage(entityId);
        this.world.addComponent(entityId, damage);

        // Add AI behavior component
        const aiBehavior = new AIBehavior(entityId);
        this.world.addComponent(entityId, aiBehavior);

        // Configure based on enemy type
        this.configureEnemyType(entityId, type);

        console.log(`Created ${type} enemy entity ${entityId} at (${x}, ${y})`);
        return entityId;
    }

    private configureEnemyType(entityId: number, type: string): void {
        const entity = this.world.getEntity(entityId);
        if (!entity) return;

        const sprite = entity.getComponent('sprite') as Sprite;
        const health = entity.getComponent('health') as Health;
        const damage = entity.getComponent('damage') as Damage;
        const velocity = entity.getComponent('velocity') as Velocity;
        const aiBehavior = entity.getComponent('aiBehavior') as AIBehavior;

        switch (type) {
            case 'grunt':
                this.configureGrunt(sprite, health, damage, velocity, aiBehavior);
                break;
            case 'fast':
                this.configureFastEnemy(sprite, health, damage, velocity, aiBehavior);
                break;
            case 'tank':
                this.configureTankEnemy(sprite, health, damage, velocity, aiBehavior);
                break;
            case 'boss':
                this.configureBossEnemy(sprite, health, damage, velocity, aiBehavior);
                break;
            default:
                console.log(`Unknown enemy type: ${type}, using grunt configuration`);
                this.configureGrunt(sprite, health, damage, velocity, aiBehavior);
        }
    }

    private configureGrunt(sprite: Sprite, health: Health, damage: Damage, velocity: Velocity, aiBehavior: AIBehavior): void {
        sprite.setCircle(12, '#ff0000');
        sprite.setLayer(5);
        
        health.setMaxHealth(50);
        health.setRegeneration(0);
        
        damage.setBaseDamage(15);
        damage.setMeleeDamage(15, 30);
        damage.setDamageType('physical');
        
        velocity.setMaxSpeed(80);
        velocity.setFriction(0.9);
        
        aiBehavior.setDetectionRange(80);
        aiBehavior.setAttackRange(25);
        aiBehavior.setThreatLevel(1);
        aiBehavior.setMovementSpeeds(40, 80, 120);
        aiBehavior.setCombatBehavior(0.8, 0.4, 0.2);
    }

    private configureFastEnemy(sprite: Sprite, health: Health, damage: Damage, velocity: Velocity, aiBehavior: AIBehavior): void {
        sprite.setCircle(8, '#ff6600');
        sprite.setLayer(5);
        
        health.setMaxHealth(30);
        health.setRegeneration(0);
        
        damage.setBaseDamage(10);
        damage.setMeleeDamage(10, 20);
        damage.setDamageType('physical');
        
        velocity.setMaxSpeed(150);
        velocity.setFriction(0.95);
        
        aiBehavior.setDetectionRange(120);
        aiBehavior.setAttackRange(20);
        aiBehavior.setThreatLevel(2);
        aiBehavior.setMovementSpeeds(60, 150, 200);
        aiBehavior.setCombatBehavior(0.6, 0.5, 0.3);
    }

    private configureTankEnemy(sprite: Sprite, health: Health, damage: Damage, velocity: Velocity, aiBehavior: AIBehavior): void {
        sprite.setCircle(20, '#800000');
        sprite.setLayer(5);
        
        health.setMaxHealth(200);
        health.setRegeneration(2);
        
        damage.setBaseDamage(25);
        damage.setMeleeDamage(25, 40);
        damage.setDamageType('physical');
        
        velocity.setMaxSpeed(40);
        velocity.setFriction(0.7);
        
        aiBehavior.setDetectionRange(60);
        aiBehavior.setAttackRange(35);
        aiBehavior.setThreatLevel(3);
        aiBehavior.setMovementSpeeds(20, 40, 80);
        aiBehavior.setCombatBehavior(0.9, 0.2, 0.1);
    }

    private configureBossEnemy(sprite: Sprite, health: Health, damage: Damage, velocity: Velocity, aiBehavior: AIBehavior): void {
        sprite.setCircle(30, '#660066');
        sprite.setLayer(6);
        
        health.setMaxHealth(500);
        health.setRegeneration(5);
        
        damage.setBaseDamage(40);
        damage.setMeleeDamage(40, 50);
        damage.setRangedDamage(30, 100, 2.0);
        damage.setDamageType('magical');
        damage.setAreaDamage(20, 80);
        
        velocity.setMaxSpeed(60);
        velocity.setFriction(0.8);
        
        aiBehavior.setDetectionRange(150);
        aiBehavior.setAttackRange(50);
        aiBehavior.setThreatLevel(5);
        aiBehavior.setMovementSpeeds(30, 60, 100);
        aiBehavior.setCombatBehavior(0.95, 0.1, 0.05);
        aiBehavior.setSpecialAbilityCooldown('areaAttack', 8.0);
    }

    public createEnemyWave(waveNumber: number, spawnPoints: { x: number; y: number }[]): number[] {
        const entityIds: number[] = [];
        const enemyCount = Math.min(5 + waveNumber * 2, 20); // Cap at 20 enemies per wave
        
        for (let i = 0; i < enemyCount; i++) {
            const spawnPoint = spawnPoints[i % spawnPoints.length];
            const enemyType = this.getEnemyTypeForWave(waveNumber, i);
            const entityId = this.createEnemy(spawnPoint.x, spawnPoint.y, enemyType);
            entityIds.push(entityId);
        }

        console.log(`Created wave ${waveNumber} with ${enemyCount} enemies`);
        return entityIds;
    }

    private getEnemyTypeForWave(waveNumber: number, enemyIndex: number): string {
        if (waveNumber >= 10 && enemyIndex === 0) {
            return 'boss';
        }
        
        if (waveNumber >= 5) {
            const rand = Math.random();
            if (rand < 0.1) return 'tank';
            if (rand < 0.3) return 'fast';
            return 'grunt';
        }
        
        if (waveNumber >= 2) {
            return Math.random() < 0.2 ? 'fast' : 'grunt';
        }
        
        return 'grunt';
    }

    public upgradeEnemy(entityId: number, upgradeType: string): boolean {
        const entity = this.world.getEntity(entityId);
        if (!entity) return false;

        const health = entity.getComponent('health') as Health;
        const damage = entity.getComponent('damage') as Damage;
        const velocity = entity.getComponent('velocity') as Velocity;
        const aiBehavior = entity.getComponent('aiBehavior') as AIBehavior;

        switch (upgradeType) {
            case 'health':
                if (health) {
                    health.setMaxHealth(health.max + 20);
                    health.healToFull();
                }
                break;
            case 'damage':
                if (damage) {
                    damage.setBaseDamage(damage.baseDamage + 5);
                }
                break;
            case 'speed':
                if (velocity) {
                    velocity.setMaxSpeed(velocity.maxSpeed! + 20);
                }
                break;
            case 'range':
                if (aiBehavior) {
                    aiBehavior.setDetectionRange(aiBehavior.detectionRange + 20);
                    aiBehavior.setAttackRange(aiBehavior.attackRange + 10);
                }
                break;
            default:
                console.log(`Unknown upgrade type: ${upgradeType}`);
                return false;
        }

        console.log(`Applied ${upgradeType} upgrade to enemy ${entityId}`);
        return true;
    }
}
