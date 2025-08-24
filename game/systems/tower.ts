/**
 * TowerSystem handles tower targeting, shooting, and tower-specific logic
 * Manages tower behavior, upgrades, and combat mechanics
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { World } from '../core/ecs/world.js';
import { MathUtils } from '../core/utils.js';

export class TowerSystem extends System {
    constructor(world: World) {
        super(world, ['towerStats', 'position'], 35); // Medium priority
    }

    public update(deltaTime: number, entities: Entity[]): void {
        const deltaSeconds = deltaTime / 1000;

        for (const entity of entities) {
            this.updateTower(entity, deltaSeconds);
        }
    }

    private updateTower(entity: Entity, deltaSeconds: number): void {
        const towerStats = entity.getComponent('towerStats');
        const position = entity.getComponent('position');
        
        if (!towerStats || !position) return;

        // Update cooldowns
        if (towerStats.attackCooldown > 0) {
            towerStats.attackCooldown -= deltaSeconds;
        }

        // Find targets and attack if ready
        if (towerStats.attackCooldown <= 0) {
            const target = this.findTarget(entity, towerStats);
            if (target) {
                this.attackTarget(entity, target, towerStats);
                towerStats.attackCooldown = towerStats.attackRate;
            }
        }

        // Update special abilities
        this.updateSpecialAbilities(entity, towerStats, deltaSeconds);
    }

    private findTarget(entity: Entity, towerStats: any): Entity | null {
        const position = entity.getComponent('position');
        if (!position) return null;

        // Get all potential targets (enemies with health and position)
        const potentialTargets = this.world.getEntitiesWithComponents(['health', 'position', 'enemy']);
        
        let bestTarget: Entity | null = null;
        let bestScore = -Infinity;

        for (const target of potentialTargets) {
            const targetPos = target.getComponent('position');
            const targetHealth = target.getComponent('health');
            
            if (!targetPos || !targetHealth) continue;

            const distance = MathUtils.distance(position.x, position.y, targetPos.x, targetPos.y);
            
            // Check if target is in range
            if (distance > towerStats.range) continue;

            // Calculate target priority score
            const score = this.calculateTargetPriority(target, distance, towerStats);
            
            if (score > bestScore) {
                bestScore = score;
                bestTarget = target;
            }
        }

        return bestTarget;
    }

    private calculateTargetPriority(target: Entity, distance: number, towerStats: any): number {
        const targetHealth = target.getComponent('health');
        const targetEnemy = target.getComponent('enemy');
        
        if (!targetHealth || !targetEnemy) return 0;

        let score = 0;

        // Distance priority (closer = higher priority for some towers)
        if (towerStats.preferCloserTargets) {
            score += (towerStats.range - distance) / towerStats.range * 100;
        } else {
            score += distance / towerStats.range * 100; // Prefer farther targets
        }

        // Health priority (depends on tower type)
        if (towerStats.targetLowHealth) {
            score += (targetHealth.max - targetHealth.current) / targetHealth.max * 200;
        } else if (towerStats.targetHighHealth) {
            score += targetHealth.current / targetHealth.max * 200;
        }

        // Enemy type priority
        if (towerStats.prioritizeBosses && targetEnemy.type === 'boss') {
            score += 500;
        }

        // Threat level priority
        if (targetEnemy.threatLevel) {
            score += targetEnemy.threatLevel * 100;
        }

        return score;
    }

    private attackTarget(entity: Entity, target: Entity, towerStats: any): void {
        const position = entity.getComponent('position');
        const targetPos = target.getComponent('position');
        
        if (!position || !targetPos) return;

        // Create projectile or apply direct damage based on tower type
        if (towerStats.projectileType) {
            this.createProjectile(entity, target, towerStats);
        } else {
            this.applyDirectDamage(entity, target, towerStats);
        }

        // Trigger attack effects
        this.triggerAttackEffects(entity, target, towerStats);

        // Update tower stats
        towerStats.totalDamageDealt += towerStats.damage;
        towerStats.kills += 1;
    }

    private createProjectile(entity: Entity, target: Entity, towerStats: any): void {
        const position = entity.getComponent('position');
        const targetPos = target.getComponent('position');
        
        if (!position || !targetPos) return;

        // Create projectile entity
        const projectile = this.world.createEntity();
        
        // Add projectile components (this would use entity factories)
        // For now, just log the creation
        console.log(`Tower ${entity.getId()} created ${towerStats.projectileType} projectile`);
    }

    private applyDirectDamage(entity: Entity, target: Entity, towerStats: any): void {
        // Apply damage directly to target
        const targetHealth = target.getComponent('health');
        if (targetHealth) {
            targetHealth.current -= towerStats.damage;
        }
    }

    private triggerAttackEffects(entity: Entity, target: Entity, towerStats: any): void {
        // This would trigger visual effects, sounds, etc.
        console.log(`Tower ${entity.getId()} attacked target ${target.getId()}`);
    }

    private updateSpecialAbilities(entity: Entity, towerStats: any, deltaSeconds: number): void {
        // Update special ability cooldowns
        if (towerStats.specialAbility && towerStats.specialCooldown > 0) {
            towerStats.specialCooldown -= deltaSeconds;
        }

        // Check if special ability should be triggered
        if (towerStats.specialAbility && towerStats.specialCooldown <= 0) {
            this.triggerSpecialAbility(entity, towerStats);
            towerStats.specialCooldown = towerStats.specialCooldownMax;
        }
    }

    private triggerSpecialAbility(entity: Entity, towerStats: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        switch (towerStats.specialAbility) {
            case 'areaDamage':
                this.triggerAreaDamage(entity, towerStats);
                break;
            case 'slow':
                this.triggerSlowEffect(entity, towerStats);
                break;
            case 'stun':
                this.triggerStunEffect(entity, towerStats);
                break;
            case 'chainLightning':
                this.triggerChainLightning(entity, towerStats);
                break;
            default:
                console.log(`Unknown special ability: ${towerStats.specialAbility}`);
        }
    }

    private triggerAreaDamage(entity: Entity, towerStats: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        // Find all enemies in area
        const targets = this.world.getEntitiesWithComponents(['health', 'position', 'enemy']);
        
        for (const target of targets) {
            const targetPos = target.getComponent('position');
            if (!targetPos) continue;

            const distance = MathUtils.distance(position.x, position.y, targetPos.x, targetPos.y);
            if (distance <= towerStats.specialRange) {
                const targetHealth = target.getComponent('health');
                if (targetHealth) {
                    targetHealth.current -= towerStats.specialDamage || towerStats.damage * 0.5;
                }
            }
        }

        console.log(`Tower ${entity.getId()} triggered area damage`);
    }

    private triggerSlowEffect(entity: Entity, towerStats: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        // Find all enemies in range and apply slow effect
        const targets = this.world.getEntitiesWithComponents(['health', 'position', 'enemy']);
        
        for (const target of targets) {
            const targetPos = target.getComponent('position');
            if (!targetPos) continue;

            const distance = MathUtils.distance(position.x, position.y, targetPos.x, targetPos.y);
            if (distance <= towerStats.specialRange) {
                // Apply slow effect (this would modify enemy movement speed)
                console.log(`Slowing enemy ${target.getId()}`);
            }
        }
    }

    private triggerStunEffect(entity: Entity, towerStats: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        // Find all enemies in range and apply stun effect
        const targets = this.world.getEntitiesWithComponents(['health', 'position', 'enemy']);
        
        for (const target of targets) {
            const targetPos = target.getComponent('position');
            if (!targetPos) continue;

            const distance = MathUtils.distance(position.x, position.y, targetPos.x, targetPos.y);
            if (distance <= towerStats.specialRange) {
                // Apply stun effect (this would disable enemy actions temporarily)
                console.log(`Stunning enemy ${target.getId()}`);
            }
        }
    }

    private triggerChainLightning(entity: Entity, towerStats: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        // Find initial target
        const initialTarget = this.findTarget(entity, towerStats);
        if (!initialTarget) return;

        // Chain lightning to nearby enemies
        let currentTarget = initialTarget;
        let chainCount = 0;
        const maxChains = towerStats.chainCount || 3;

        while (currentTarget && chainCount < maxChains) {
            // Apply damage to current target
            const targetHealth = currentTarget.getComponent('health');
            if (targetHealth) {
                targetHealth.current -= towerStats.specialDamage || towerStats.damage * 0.7;
            }

            // Find next target in chain
            currentTarget = this.findNextChainTarget(currentTarget, towerStats);
            chainCount++;
        }

        console.log(`Tower ${entity.getId()} triggered chain lightning with ${chainCount} chains`);
    }

    private findNextChainTarget(currentTarget: Entity, towerStats: any): Entity | null {
        const currentPos = currentTarget.getComponent('position');
        if (!currentPos) return null;

        // Find enemies near current target
        const nearbyEnemies = this.world.getEntitiesWithComponents(['health', 'position', 'enemy']);
        
        let bestTarget: Entity | null = null;
        let bestDistance = Infinity;

        for (const enemy of nearbyEnemies) {
            if (enemy.getId() === currentTarget.getId()) continue;

            const enemyPos = enemy.getComponent('position');
            if (!enemyPos) continue;

            const distance = MathUtils.distance(currentPos.x, currentPos.y, enemyPos.x, enemyPos.y);
            if (distance <= towerStats.chainRange && distance < bestDistance) {
                bestDistance = distance;
                bestTarget = enemy;
            }
        }

        return bestTarget;
    }

    public upgradeTower(entity: Entity, upgradeType: string): boolean {
        const towerStats = entity.getComponent('towerStats');
        if (!towerStats) return false;

        // Check if upgrade is available
        if (!towerStats.upgrades || !towerStats.upgrades[upgradeType]) {
            return false;
        }

        const upgrade = towerStats.upgrades[upgradeType];
        
        // Apply upgrade effects
        if (upgrade.damage) towerStats.damage += upgrade.damage;
        if (upgrade.range) towerStats.range += upgrade.range;
        if (upgrade.attackRate) towerStats.attackRate = Math.max(0.1, towerStats.attackRate - upgrade.attackRate);
        if (upgrade.specialDamage) towerStats.specialDamage = (towerStats.specialDamage || 0) + upgrade.specialDamage;

        // Mark upgrade as applied
        towerStats.appliedUpgrades = towerStats.appliedUpgrades || [];
        towerStats.appliedUpgrades.push(upgradeType);

        console.log(`Tower ${entity.getId()} upgraded with ${upgradeType}`);
        return true;
    }
}
