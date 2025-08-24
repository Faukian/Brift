/**
 * CombatSystem handles attack, health, and damage logic
 * Manages combat interactions between entities
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { World } from '../core/ecs/world.js';
import { MathUtils } from '../core/utils.js';

export class CombatSystem extends System {
    constructor(world: World) {
        super(world, ['health'], 40); // Medium-high priority
    }

    public update(deltaTime: number, entities: Entity[]): void {
        const deltaSeconds = deltaTime / 1000;

        for (const entity of entities) {
            this.updateHealth(entity, deltaSeconds);
            this.processAttacks(entity, deltaSeconds);
        }
    }

    private updateHealth(entity: Entity, deltaSeconds: number): void {
        const health = entity.getComponent('health');
        if (!health) return;

        // Regenerate health if applicable
        if (health.regeneration && health.current < health.max) {
            health.current = Math.min(health.max, health.current + health.regeneration * deltaSeconds);
        }

        // Update invulnerability timer
        if (health.invulnerabilityTimer > 0) {
            health.invulnerabilityTimer -= deltaSeconds;
        }

        // Check if entity should be destroyed
        if (health.current <= 0 && !health.isDead) {
            this.handleEntityDeath(entity);
        }
    }

    private processAttacks(entity: Entity, deltaSeconds: number): void {
        const health = entity.getComponent('health');
        const damage = entity.getComponent('damage');
        const aiBehavior = entity.getComponent('aiBehavior');

        if (!health || !damage) return;

        // Process melee attacks
        if (damage.meleeRange && aiBehavior?.isAttacking) {
            this.processMeleeAttack(entity, damage);
        }

        // Process ranged attacks
        if (damage.rangedRange && damage.rangedCooldown !== undefined) {
            damage.rangedCooldown -= deltaSeconds;
            if (damage.rangedCooldown <= 0) {
                this.processRangedAttack(entity, damage);
                damage.rangedCooldown = damage.rangedCooldownMax || 1.0;
            }
        }
    }

    private processMeleeAttack(entity: Entity, damage: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        // Find targets in melee range
        const targets = this.findTargetsInRange(entity, damage.meleeRange);
        
        for (const target of targets) {
            this.dealDamage(entity, target, damage.meleeDamage || damage.baseDamage || 10);
        }
    }

    private processRangedAttack(entity: Entity, damage: any): void {
        const position = entity.getComponent('position');
        if (!position) return;

        // Find targets in ranged range
        const targets = this.findTargetsInRange(entity, damage.rangedRange);
        
        if (targets.length > 0) {
            // Find closest target
            const closestTarget = this.findClosestTarget(entity, targets);
            if (closestTarget) {
                this.createProjectile(entity, closestTarget, damage);
            }
        }
    }

    private findTargetsInRange(entity: Entity, range: number): Entity[] {
        const targets: Entity[] = [];
        const position = entity.getComponent('position');
        if (!position) return targets;

        // Get all entities with health (potential targets)
        const potentialTargets = this.world.getEntitiesWithComponents(['health', 'position']);
        
        for (const target of potentialTargets) {
            if (target.getId() === entity.getId()) continue; // Skip self
            
            const targetPos = target.getComponent('position');
            if (!targetPos) continue;

            const distance = MathUtils.distance(position.x, position.y, targetPos.x, targetPos.y);
            if (distance <= range) {
                targets.push(target);
            }
        }

        return targets;
    }

    private findClosestTarget(entity: Entity, targets: Entity[]): Entity | null {
        if (targets.length === 0) return null;

        const position = entity.getComponent('position');
        if (!position) return null;

        let closestTarget: Entity | null = null;
        let closestDistance = Infinity;

        for (const target of targets) {
            const targetPos = target.getComponent('position');
            if (!targetPos) continue;

            const distance = MathUtils.distance(position.x, position.y, targetPos.x, targetPos.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = target;
            }
        }

        return closestTarget;
    }

    private createProjectile(entity: Entity, target: Entity, damage: any): void {
        const position = entity.getComponent('position');
        const targetPos = target.getComponent('position');
        
        if (!position || !targetPos) return;

        // Create projectile entity
        const projectile = this.world.createEntity();
        
        // Add projectile components (this would use entity factories)
        // For now, just log the creation
        console.log(`Projectile created from ${entity.getId()} to ${target.getId()}`);
    }

    public dealDamage(attacker: Entity, target: Entity, damageAmount: number): void {
        const targetHealth = target.getComponent('health');
        if (!targetHealth) return;

        // Check if target is invulnerable
        if (targetHealth.invulnerabilityTimer > 0) return;

        // Apply damage
        targetHealth.current -= damageAmount;

        // Set invulnerability timer if applicable
        if (targetHealth.invulnerabilityTime > 0) {
            targetHealth.invulnerabilityTimer = targetHealth.invulnerabilityTime;
        }

        // Trigger damage effects
        this.triggerDamageEffects(target, damageAmount);

        // Check for critical hits
        const attackerDamage = attacker.getComponent('damage');
        if (attackerDamage?.criticalChance && Math.random() < attackerDamage.criticalChance) {
            const criticalDamage = damageAmount * (attackerDamage.criticalMultiplier || 2.0);
            targetHealth.current -= criticalDamage;
            this.triggerCriticalHit(target, criticalDamage);
        }
    }

    private triggerDamageEffects(entity: Entity, damageAmount: number): void {
        // This would trigger visual effects, sounds, etc.
        // For now, just log the damage
        console.log(`Entity ${entity.getId()} took ${damageAmount} damage`);
    }

    private triggerCriticalHit(entity: Entity, criticalDamage: number): void {
        // This would trigger critical hit effects
        console.log(`Critical hit on entity ${entity.getId()} for ${criticalDamage} damage`);
    }

    private handleEntityDeath(entity: Entity): void {
        const health = entity.getComponent('health');
        if (!health) return;

        health.isDead = true;

        // Trigger death effects
        this.triggerDeathEffects(entity);

        // Schedule entity removal
        setTimeout(() => {
            this.world.removeEntity(entity.getId());
        }, health.deathDelay || 1000);
    }

    private triggerDeathEffects(entity: Entity): void {
        // This would trigger death animations, sounds, loot drops, etc.
        console.log(`Entity ${entity.getId()} died`);
    }

    public healEntity(entity: Entity, healAmount: number): void {
        const health = entity.getComponent('health');
        if (!health) return;

        health.current = Math.min(health.max, health.current + healAmount);
    }

    public isEntityDead(entity: Entity): boolean {
        const health = entity.getComponent('health');
        return health ? health.isDead || health.current <= 0 : false;
    }
}
