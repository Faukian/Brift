/**
 * AIBehavior component stores AI behavior and state data
 * Pure data component with no logic
 */

import { Component } from '../core/ecs/component.js';

export class AIBehavior extends Component {
    public currentState: string;
    public previousState: string;
    public stateTimer: number;
    public stateDurations?: { [key: string]: number };
    public isAttacking: boolean;
    public targetId?: number; // ID of current target entity
    public lastTargetId?: number; // ID of previous target entity
    
    // Detection and targeting
    public detectionRange: number;
    public attackRange: number;
    public threatLevel: number;
    
    // Movement behavior
    public patrolSpeed: number;
    public chaseSpeed: number;
    public fleeSpeed: number;
    public patrolPoints?: { x: number; y: number }[];
    public currentPatrolIndex: number;
    
    // Combat behavior
    public aggression: number; // 0-1, affects when to attack vs flee
    public fearThreshold: number; // Health percentage when to flee
    public fleeThreshold: number; // Health percentage when to flee
    public groupBehavior: boolean; // Whether to coordinate with nearby allies
    public callForHelp: boolean; // Whether to alert nearby allies when attacked
    
    // Special abilities
    public specialAbilities?: string[];
    public specialAbilityCooldowns?: { [key: string]: number };
    public specialAbilityTimers?: { [key: string]: number };

    constructor(entityId: number) {
        super('aiBehavior', entityId);
        this.currentState = 'idle';
        this.previousState = 'idle';
        this.stateTimer = 0;
        this.isAttacking = false;
        this.detectionRange = 100;
        this.attackRange = 50;
        this.threatLevel = 1;
        this.patrolSpeed = 50;
        this.chaseSpeed = 80;
        this.fleeSpeed = 100;
        this.currentPatrolIndex = 0;
        this.aggression = 0.7;
        this.fearThreshold = 0.3;
        this.fleeThreshold = 0.2;
        this.groupBehavior = false;
        this.callForHelp = true;
    }

    public clone(): Component {
        const cloned = new AIBehavior(this.entityId);
        cloned.currentState = this.currentState;
        cloned.previousState = this.previousState;
        cloned.stateTimer = this.stateTimer;
        cloned.isAttacking = this.isAttacking;
        cloned.targetId = this.targetId;
        cloned.lastTargetId = this.lastTargetId;
        cloned.detectionRange = this.detectionRange;
        cloned.attackRange = this.attackRange;
        cloned.threatLevel = this.threatLevel;
        cloned.patrolSpeed = this.patrolSpeed;
        cloned.chaseSpeed = this.chaseSpeed;
        cloned.fleeSpeed = this.fleeSpeed;
        cloned.currentPatrolIndex = this.currentPatrolIndex;
        cloned.aggression = this.aggression;
        cloned.fearThreshold = this.fearThreshold;
        cloned.fleeThreshold = this.fleeThreshold;
        cloned.groupBehavior = this.groupBehavior;
        cloned.callForHelp = this.callForHelp;
        
        if (this.stateDurations) {
            cloned.stateDurations = { ...this.stateDurations };
        }
        if (this.patrolPoints) {
            cloned.patrolPoints = [...this.patrolPoints];
        }
        if (this.specialAbilities) {
            cloned.specialAbilities = [...this.specialAbilities];
        }
        if (this.specialAbilityCooldowns) {
            cloned.specialAbilityCooldowns = { ...this.specialAbilityCooldowns };
        }
        if (this.specialAbilityTimers) {
            cloned.specialAbilityTimers = { ...this.specialAbilityTimers };
        }
        
        return cloned;
    }

    public setState(state: string): void {
        this.previousState = this.currentState;
        this.currentState = state;
        this.stateTimer = this.stateDurations?.[state] || 5.0;
    }

    public setStateDurations(durations: { [key: string]: number }): void {
        this.stateDurations = durations;
    }

    public setDetectionRange(range: number): void {
        this.detectionRange = Math.max(0, range);
    }

    public setAttackRange(range: number): void {
        this.attackRange = Math.max(0, range);
    }

    public setThreatLevel(level: number): void {
        this.threatLevel = Math.max(0, level);
    }

    public setMovementSpeeds(patrol: number, chase: number, flee: number): void {
        this.patrolSpeed = Math.max(0, patrol);
        this.chaseSpeed = Math.max(0, chase);
        this.fleeSpeed = Math.max(0, flee);
    }

    public setPatrolPoints(points: { x: number; y: number }[]): void {
        this.patrolPoints = [...points];
        this.currentPatrolIndex = 0;
    }

    public addPatrolPoint(x: number, y: number): void {
        if (!this.patrolPoints) {
            this.patrolPoints = [];
        }
        this.patrolPoints.push({ x, y });
    }

    public getCurrentPatrolPoint(): { x: number; y: number } | null {
        if (!this.patrolPoints || this.patrolPoints.length === 0) return null;
        return this.patrolPoints[this.currentPatrolIndex];
    }

    public nextPatrolPoint(): void {
        if (!this.patrolPoints || this.patrolPoints.length === 0) return;
        this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPoints.length;
    }

    public setCombatBehavior(aggression: number, fearThreshold: number, fleeThreshold: number): void {
        this.aggression = Math.max(0, Math.min(1, aggression));
        this.fearThreshold = Math.max(0, Math.min(1, fearThreshold));
        this.fleeThreshold = Math.max(0, Math.min(1, fleeThreshold));
    }

    public setGroupBehavior(groupBehavior: boolean, callForHelp: boolean): void {
        this.groupBehavior = groupBehavior;
        this.callForHelp = callForHelp;
    }

    public setTarget(targetId: number): void {
        this.lastTargetId = this.targetId;
        this.targetId = targetId;
    }

    public clearTarget(): void {
        this.lastTargetId = this.targetId;
        this.targetId = undefined;
    }

    public hasTarget(): boolean {
        return this.targetId !== undefined;
    }

    public isInState(state: string): boolean {
        return this.currentState === state;
    }

    public wasInState(state: string): boolean {
        return this.previousState === state;
    }

    public canChangeState(): boolean {
        return this.stateTimer <= 0;
    }

    public getStateTimeRemaining(): number {
        return Math.max(0, this.stateTimer);
    }

    public shouldFlee(healthPercentage: number): boolean {
        return healthPercentage <= this.fleeThreshold;
    }

    public shouldBeAggressive(healthPercentage: number): boolean {
        return healthPercentage > this.fearThreshold && Math.random() < this.aggression;
    }

    public canUseSpecialAbility(abilityName: string): boolean {
        if (!this.specialAbilities || !this.specialAbilities.includes(abilityName)) {
            return false;
        }
        
        if (!this.specialAbilityTimers || !this.specialAbilityTimers[abilityName]) {
            return true;
        }
        
        return this.specialAbilityTimers[abilityName] <= 0;
    }

    public setSpecialAbilityCooldown(abilityName: string, cooldown: number): void {
        if (!this.specialAbilities) {
            this.specialAbilities = [];
        }
        if (!this.specialAbilities.includes(abilityName)) {
            this.specialAbilities.push(abilityName);
        }
        
        if (!this.specialAbilityCooldowns) {
            this.specialAbilityCooldowns = {};
        }
        if (!this.specialAbilityTimers) {
            this.specialAbilityTimers = {};
        }
        
        this.specialAbilityCooldowns[abilityName] = cooldown;
        this.specialAbilityTimers[abilityName] = 0;
    }

    public useSpecialAbility(abilityName: string): void {
        if (!this.specialAbilityTimers || !this.specialAbilityCooldowns) return;
        
        const cooldown = this.specialAbilityCooldowns[abilityName];
        if (cooldown !== undefined) {
            this.specialAbilityTimers[abilityName] = cooldown;
        }
    }

    public updateSpecialAbilityTimers(deltaTime: number): void {
        if (!this.specialAbilityTimers) return;
        
        for (const ability in this.specialAbilityTimers) {
            if (this.specialAbilityTimers[ability] > 0) {
                this.specialAbilityTimers[ability] -= deltaTime;
            }
        }
    }

    public getSpecialAbilityCooldown(abilityName: string): number {
        if (!this.specialAbilityTimers || !this.specialAbilityTimers[abilityName]) {
            return 0;
        }
        return Math.max(0, this.specialAbilityTimers[abilityName]);
    }

    public getSpecialAbilityProgress(abilityName: string): number {
        if (!this.specialAbilityTimers || !this.specialAbilityCooldowns) return 0;
        
        const timer = this.specialAbilityTimers[abilityName] || 0;
        const cooldown = this.specialAbilityCooldowns[abilityName] || 1;
        
        if (cooldown <= 0) return 100;
        return Math.max(0, Math.min(100, (1 - timer / cooldown) * 100));
    }

    public reset(): void {
        this.currentState = 'idle';
        this.previousState = 'idle';
        this.stateTimer = 0;
        this.isAttacking = false;
        this.targetId = undefined;
        this.lastTargetId = undefined;
        this.currentPatrolIndex = 0;
        
        if (this.specialAbilityTimers) {
            for (const ability in this.specialAbilityTimers) {
                this.specialAbilityTimers[ability] = 0;
            }
        }
    }
}
