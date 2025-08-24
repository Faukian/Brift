/**
 * TowerStats component stores tower-specific data
 * Pure data component with no logic
 */

import { Component } from '../core/ecs/component.js';

export class TowerStats extends Component {
    public type: string;
    public level: number;
    public damage: number;
    public range: number;
    public attackRate: number;
    public attackCooldown: number;
    public projectileType?: string;
    public projectileSpeed?: number;
    public specialAbility?: string;
    public specialCooldown: number;
    public specialCooldownMax: number;
    public specialDamage?: number;
    public specialRange?: number;
    public chainCount?: number;
    public chainRange?: number;
    public preferCloserTargets: boolean;
    public targetLowHealth: boolean;
    public targetHighHealth: boolean;
    public prioritizeBosses: boolean;
    public totalDamageDealt: number;
    public kills: number;
    public upgrades?: Map<string, any>;
    public appliedUpgrades: string[];

    constructor(entityId: number, type: string = 'basic') {
        super('towerStats', entityId);
        this.type = type;
        this.level = 1;
        this.damage = 20;
        this.range = 100;
        this.attackRate = 1.0;
        this.attackCooldown = 0;
        this.specialCooldown = 0;
        this.specialCooldownMax = 10;
        this.preferCloserTargets = false;
        this.targetLowHealth = false;
        this.targetHighHealth = false;
        this.prioritizeBosses = false;
        this.totalDamageDealt = 0;
        this.kills = 0;
        this.appliedUpgrades = [];
    }

    public clone(): Component {
        const cloned = new TowerStats(this.entityId, this.type);
        cloned.level = this.level;
        cloned.damage = this.damage;
        cloned.range = this.range;
        cloned.attackRate = this.attackRate;
        cloned.attackCooldown = this.attackCooldown;
        cloned.projectileType = this.projectileType;
        cloned.projectileSpeed = this.projectileSpeed;
        cloned.specialAbility = this.specialAbility;
        cloned.specialCooldown = this.specialCooldown;
        cloned.specialCooldownMax = this.specialCooldownMax;
        cloned.specialDamage = this.specialDamage;
        cloned.specialRange = this.specialRange;
        cloned.chainCount = this.chainCount;
        cloned.chainRange = this.chainRange;
        cloned.preferCloserTargets = this.preferCloserTargets;
        cloned.targetLowHealth = this.targetLowHealth;
        cloned.targetHighHealth = this.targetHighHealth;
        cloned.prioritizeBosses = this.prioritizeBosses;
        cloned.totalDamageDealt = this.totalDamageDealt;
        cloned.kills = this.kills;
        cloned.appliedUpgrades = [...this.appliedUpgrades];
        return cloned;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public setLevel(level: number): void {
        this.level = Math.max(1, level);
    }

    public setDamage(damage: number): void {
        this.damage = Math.max(0, damage);
    }

    public setRange(range: number): void {
        this.range = Math.max(0, range);
    }

    public setAttackRate(rate: number): void {
        this.attackRate = Math.max(0.1, rate);
    }

    public setProjectileType(type: string, speed: number): void {
        this.projectileType = type;
        this.projectileSpeed = speed;
    }

    public setSpecialAbility(ability: string, cooldown: number, damage?: number, range?: number): void {
        this.specialAbility = ability;
        this.specialCooldownMax = cooldown;
        this.specialCooldown = 0;
        if (damage !== undefined) this.specialDamage = damage;
        if (range !== undefined) this.specialRange = range;
    }

    public setChainLightning(count: number, range: number): void {
        this.chainCount = count;
        this.chainRange = range;
    }

    public setTargetingPreferences(preferCloser: boolean, targetLowHealth: boolean, targetHighHealth: boolean, prioritizeBosses: boolean): void {
        this.preferCloserTargets = preferCloser;
        this.targetLowHealth = targetLowHealth;
        this.targetHighHealth = targetHighHealth;
        this.prioritizeBosses = prioritizeBosses;
    }

    public canAttack(): boolean {
        return this.attackCooldown <= 0;
    }

    public canUseSpecialAbility(): boolean {
        return this.specialAbility && this.specialCooldown <= 0;
    }

    public resetAttackCooldown(): void {
        this.attackCooldown = this.attackRate;
    }

    public resetSpecialCooldown(): void {
        this.specialCooldown = this.specialCooldownMax;
    }

    public addKill(): void {
        this.kills++;
    }

    public addDamage(damage: number): void {
        this.totalDamageDealt += damage;
    }

    public getDamagePerSecond(): number {
        return this.damage / this.attackRate;
    }

    public getEfficiency(): number {
        if (this.kills === 0) return 0;
        return this.totalDamageDealt / this.kills;
    }

    public hasUpgrade(upgradeType: string): boolean {
        return this.appliedUpgrades.includes(upgradeType);
    }

    public addUpgrade(upgradeType: string): void {
        if (!this.hasUpgrade(upgradeType)) {
            this.appliedUpgrades.push(upgradeType);
        }
    }
}
