/**
 * Damage component stores attack and damage data
 * Pure data component with no logic
 */

import { Component } from '../core/ecs/component.js';

export class Damage extends Component {
    public baseDamage: number;
    public meleeDamage?: number;
    public rangedDamage?: number;
    public meleeRange?: number;
    public rangedRange?: number;
    public criticalChance: number; // 0-1
    public criticalMultiplier: number;
    public damageType: 'physical' | 'magical' | 'fire' | 'ice' | 'lightning' | 'poison';
    public penetration?: number; // Armor penetration
    public areaDamage?: number; // Area of effect damage
    public areaRange?: number; // Area of effect range
    public damageOverTime?: number; // Damage per second
    public damageOverTimeDuration?: number; // Duration in seconds
    public rangedCooldown?: number; // Time between ranged attacks
    public rangedCooldownMax?: number; // Maximum cooldown time

    constructor(entityId: number, baseDamage: number = 10, damageType: 'physical' | 'magical' | 'fire' | 'ice' | 'lightning' | 'poison' = 'physical') {
        super('damage', entityId);
        this.baseDamage = baseDamage;
        this.damageType = damageType;
        this.criticalChance = 0.05; // 5% default
        this.criticalMultiplier = 2.0; // 2x damage default
    }

    public clone(): Component {
        const cloned = new Damage(this.entityId, this.baseDamage, this.damageType);
        cloned.meleeDamage = this.meleeDamage;
        cloned.rangedDamage = this.rangedDamage;
        cloned.meleeRange = this.meleeRange;
        cloned.rangedRange = this.rangedRange;
        cloned.criticalChance = this.criticalChance;
        cloned.criticalMultiplier = this.criticalMultiplier;
        cloned.penetration = this.penetration;
        cloned.areaDamage = this.areaDamage;
        cloned.areaRange = this.areaRange;
        cloned.damageOverTime = this.damageOverTime;
        cloned.damageOverTimeDuration = this.damageOverTimeDuration;
        cloned.rangedCooldown = this.rangedCooldown;
        cloned.rangedCooldownMax = this.rangedCooldownMax;
        return cloned;
    }

    public setBaseDamage(damage: number): void {
        this.baseDamage = damage;
    }

    public setMeleeDamage(damage: number, range: number): void {
        this.meleeDamage = damage;
        this.meleeRange = range;
    }

    public setRangedDamage(damage: number, range: number, cooldown: number): void {
        this.rangedDamage = damage;
        this.rangedRange = range;
        this.rangedCooldown = cooldown;
        this.rangedCooldownMax = cooldown;
    }

    public setCriticalStats(chance: number, multiplier: number): void {
        this.criticalChance = Math.max(0, Math.min(1, chance));
        this.criticalMultiplier = Math.max(1, multiplier);
    }

    public setDamageType(type: 'physical' | 'magical' | 'fire' | 'ice' | 'lightning' | 'poison'): void {
        this.damageType = type;
    }

    public setPenetration(penetration: number): void {
        this.penetration = Math.max(0, penetration);
    }

    public setAreaDamage(damage: number, range: number): void {
        this.areaDamage = damage;
        this.areaRange = range;
    }

    public setDamageOverTime(damage: number, duration: number): void {
        this.damageOverTime = damage;
        this.damageOverTimeDuration = duration;
    }

    public getEffectiveDamage(attackType: 'melee' | 'ranged' = 'melee'): number {
        if (attackType === 'melee' && this.meleeDamage !== undefined) {
            return this.meleeDamage;
        }
        if (attackType === 'ranged' && this.rangedDamage !== undefined) {
            return this.rangedDamage;
        }
        return this.baseDamage;
    }

    public getAttackRange(attackType: 'melee' | 'ranged' = 'melee'): number {
        if (attackType === 'melee' && this.meleeRange !== undefined) {
            return this.meleeRange;
        }
        if (attackType === 'ranged' && this.rangedRange !== undefined) {
            return this.rangedRange;
        }
        return 0;
    }

    public canPerformRangedAttack(): boolean {
        return this.rangedCooldown !== undefined && this.rangedCooldown <= 0;
    }

    public resetRangedCooldown(): void {
        if (this.rangedCooldownMax !== undefined) {
            this.rangedCooldown = this.rangedCooldownMax;
        }
    }

    public isCriticalHit(): boolean {
        return Math.random() < this.criticalChance;
    }

    public getCriticalDamage(baseDamage: number): number {
        return baseDamage * this.criticalMultiplier;
    }

    public hasAreaDamage(): boolean {
        return this.areaDamage !== undefined && this.areaRange !== undefined;
    }

    public hasDamageOverTime(): boolean {
        return this.damageOverTime !== undefined && this.damageOverTimeDuration !== undefined;
    }
}
