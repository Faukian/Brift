/**
 * AISystem handles enemy AI behavior and decision making
 * Controls enemy movement, targeting, and behavior patterns
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { World } from '../core/ecs/world.js';
import { MathUtils } from '../core/utils.js';

export class AISystem extends System {
    constructor(world: World) {
        super(world, ['position', 'aiBehavior'], 30); // Lower priority than physics
    }

    public update(deltaTime: number, entities: Entity[]): void {
        const deltaSeconds = deltaTime / 1000;

        for (const entity of entities) {
            this.updateAI(entity, deltaSeconds);
        }
    }

    private updateAI(entity: Entity, deltaSeconds: number): void {
        const aiBehavior = entity.getComponent('aiBehavior');
        const position = entity.getComponent('position');
        const velocity = entity.getComponent('velocity');

        if (!aiBehavior || !position) return;

        // Update AI state machine
        this.updateStateMachine(entity, aiBehavior, deltaSeconds);

        // Execute current behavior
        this.executeBehavior(entity, aiBehavior, deltaSeconds);
    }

    private updateStateMachine(entity: Entity, aiBehavior: any, deltaSeconds: number): void {
        // Update timers
        if (aiBehavior.stateTimer !== undefined) {
            aiBehavior.stateTimer -= deltaSeconds;
            if (aiBehavior.stateTimer <= 0) {
                this.changeState(entity, aiBehavior, 'idle');
            }
        }

        // Check for state transitions
        switch (aiBehavior.currentState) {
            case 'idle':
                this.checkIdleTransitions(entity, aiBehavior);
                break;
            case 'patrol':
                this.checkPatrolTransitions(entity, aiBehavior);
                break;
            case 'chase':
                this.checkChaseTransitions(entity, aiBehavior);
                break;
            case 'attack':
                this.checkAttackTransitions(entity, aiBehavior);
                break;
            case 'flee':
                this.checkFleeTransitions(entity, aiBehavior);
                break;
        }
    }

    private checkIdleTransitions(entity: Entity, aiBehavior: any): void {
        // Check if player is in detection range
        const player = this.findNearestPlayer(entity);
        if (player && this.isInRange(entity, player, aiBehavior.detectionRange)) {
            this.changeState(entity, aiBehavior, 'chase');
            return;
        }

        // Randomly start patrolling
        if (Math.random() < 0.01) { // 1% chance per frame
            this.changeState(entity, aiBehavior, 'patrol');
        }
    }

    private checkPatrolTransitions(entity: Entity, aiBehavior: any): void {
        // Check if player is in detection range
        const player = this.findNearestPlayer(entity);
        if (player && this.isInRange(entity, player, aiBehavior.detectionRange)) {
            this.changeState(entity, aiBehavior, 'chase');
            return;
        }

        // Check if patrol point reached
        if (this.hasReachedPatrolPoint(entity, aiBehavior)) {
            this.setNextPatrolPoint(entity, aiBehavior);
        }
    }

    private checkChaseTransitions(entity: Entity, aiBehavior: any): void {
        const player = this.findNearestPlayer(entity);
        if (!player) {
            this.changeState(entity, aiBehavior, 'idle');
            return;
        }

        // Check if player is too far away
        if (!this.isInRange(entity, player, aiBehavior.detectionRange * 1.5)) {
            this.changeState(entity, aiBehavior, 'idle');
            return;
        }

        // Check if close enough to attack
        if (this.isInRange(entity, player, aiBehavior.attackRange)) {
            this.changeState(entity, aiBehavior, 'attack');
        }
    }

    private checkAttackTransitions(entity: Entity, aiBehavior: any): void {
        const player = this.findNearestPlayer(entity);
        if (!player) {
            this.changeState(entity, aiBehavior, 'idle');
            return;
        }

        // Check if player moved out of attack range
        if (!this.isInRange(entity, player, aiBehavior.attackRange)) {
            this.changeState(entity, aiBehavior, 'chase');
            return;
        }

        // Check if health is low and should flee
        const health = entity.getComponent('health');
        if (health && health.current < health.max * aiBehavior.fleeThreshold) {
            this.changeState(entity, aiBehavior, 'flee');
        }
    }

    private checkFleeTransitions(entity: Entity, aiBehavior: any): void {
        // Check if health has recovered
        const health = entity.getComponent('health');
        if (health && health.current > health.max * aiBehavior.fleeThreshold * 1.5) {
            this.changeState(entity, aiBehavior, 'idle');
            return;
        }

        // Check if safe distance reached
        const player = this.findNearestPlayer(entity);
        if (player && !this.isInRange(entity, player, aiBehavior.detectionRange * 2)) {
            this.changeState(entity, aiBehavior, 'idle');
        }
    }

    private executeBehavior(entity: Entity, aiBehavior: any, deltaSeconds: number): void {
        switch (aiBehavior.currentState) {
            case 'idle':
                this.executeIdle(entity, aiBehavior, deltaSeconds);
                break;
            case 'patrol':
                this.executePatrol(entity, aiBehavior, deltaSeconds);
                break;
            case 'chase':
                this.executeChase(entity, aiBehavior, deltaSeconds);
                break;
            case 'attack':
                this.executeAttack(entity, aiBehavior, deltaSeconds);
                break;
            case 'flee':
                this.executeFlee(entity, aiBehavior, deltaSeconds);
                break;
        }
    }

    private executeIdle(entity: Entity, aiBehavior: any, deltaSeconds: number): void {
        // Stop movement
        const velocity = entity.getComponent('velocity');
        if (velocity) {
            velocity.x = 0;
            velocity.y = 0;
        }
    }

    private executePatrol(entity: Entity, aiBehavior: any, deltaSeconds: number): void {
        const velocity = entity.getComponent('velocity');
        const position = entity.getComponent('position');
        if (!velocity || !position) return;

        // Move towards current patrol point
        const target = aiBehavior.patrolPoints[aiBehavior.currentPatrolIndex];
        if (target) {
            const dx = target.x - position.x;
            const dy = target.y - position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                velocity.x = (dx / distance) * aiBehavior.patrolSpeed;
                velocity.y = (dy / distance) * aiBehavior.patrolSpeed;
            }
        }
    }

    private executeChase(entity: Entity, aiBehavior: any, deltaSeconds: number): void {
        const velocity = entity.getComponent('velocity');
        const position = entity.getComponent('position');
        const player = this.findNearestPlayer(entity);
        
        if (!velocity || !position || !player) return;

        const playerPos = player.getComponent('position');
        if (!playerPos) return;

        // Move towards player
        const dx = playerPos.x - position.x;
        const dy = playerPos.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            velocity.x = (dx / distance) * aiBehavior.chaseSpeed;
            velocity.y = (dy / distance) * aiBehavior.chaseSpeed;
        }
    }

    private executeAttack(entity: Entity, aiBehavior: any, deltaSeconds: number): void {
        // Stop movement and attack
        const velocity = entity.getComponent('velocity');
        if (velocity) {
            velocity.x = 0;
            velocity.y = 0;
        }

        // Attack logic would be handled by CombatSystem
        // This system just sets the attack flag
        aiBehavior.isAttacking = true;
    }

    private executeFlee(entity: Entity, aiBehavior: any, deltaSeconds: number): void {
        const velocity = entity.getComponent('velocity');
        const position = entity.getComponent('position');
        const player = this.findNearestPlayer(entity);
        
        if (!velocity || !position || !player) return;

        const playerPos = player.getComponent('position');
        if (!playerPos) return;

        // Move away from player
        const dx = position.x - playerPos.x;
        const dy = position.y - playerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            velocity.x = (dx / distance) * aiBehavior.fleeSpeed;
            velocity.y = (dy / distance) * aiBehavior.fleeSpeed;
        }
    }

    private changeState(entity: Entity, aiBehavior: any, newState: string): void {
        aiBehavior.previousState = aiBehavior.currentState;
        aiBehavior.currentState = newState;
        aiBehavior.stateTimer = aiBehavior.stateDurations?.[newState] || 5.0;
        
        // Reset state-specific variables
        aiBehavior.isAttacking = false;
    }

    private findNearestPlayer(entity: Entity): Entity | null {
        // This would need to be implemented based on how players are identified
        // For now, return null
        return null;
    }

    private isInRange(entity: Entity, target: Entity, range: number): boolean {
        const posA = entity.getComponent('position');
        const posB = target.getComponent('position');
        
        if (!posA || !posB) return false;
        
        const distance = MathUtils.distance(posA.x, posA.y, posB.x, posB.y);
        return distance <= range;
    }

    private hasReachedPatrolPoint(entity: Entity, aiBehavior: any): boolean {
        const position = entity.getComponent('position');
        if (!position || !aiBehavior.patrolPoints) return false;

        const target = aiBehavior.patrolPoints[aiBehavior.currentPatrolIndex];
        if (!target) return false;

        const distance = MathUtils.distance(position.x, position.y, target.x, target.y);
        return distance < 10; // Within 10 pixels
    }

    private setNextPatrolPoint(entity: Entity, aiBehavior: any): void {
        if (!aiBehavior.patrolPoints) return;
        
        aiBehavior.currentPatrolIndex = (aiBehavior.currentPatrolIndex + 1) % aiBehavior.patrolPoints.length;
    }
}
