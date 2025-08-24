/**
 * Health component stores entity health and status data
 * Pure data component with no logic
 */

import { Component } from '../core/ecs/component.js';

export class Health extends Component {
    public current: number;
    public max: number;
    public regeneration?: number; // Health per second
    public isDead: boolean;
    public isInvulnerable: boolean;
    public invulnerabilityTime: number; // Seconds of invulnerability after taking damage
    public invulnerabilityTimer: number; // Current invulnerability timer
    public deathDelay: number; // Delay before entity is removed (for death animations)
    public onDeath?: () => void; // Callback when entity dies
    public onDamage?: (damage: number) => void; // Callback when entity takes damage
    public onHeal?: (amount: number) => void; // Callback when entity is healed

    constructor(entityId: number, maxHealth: number = 100) {
        super('health', entityId);
        this.current = maxHealth;
        this.max = maxHealth;
        this.isDead = false;
        this.isInvulnerable = false;
        this.invulnerabilityTime = 0;
        this.invulnerabilityTimer = 0;
        this.deathDelay = 1000; // 1 second default
    }

    public clone(): Component {
        const cloned = new Health(this.entityId, this.max);
        cloned.current = this.current;
        cloned.regeneration = this.regeneration;
        cloned.isDead = this.isDead;
        cloned.isInvulnerable = this.isInvulnerable;
        cloned.invulnerabilityTime = this.invulnerabilityTime;
        cloned.invulnerabilityTimer = this.invulnerabilityTimer;
        cloned.deathDelay = this.deathDelay;
        return cloned;
    }

    public setMaxHealth(maxHealth: number): void {
        this.max = maxHealth;
        if (this.current > this.max) {
            this.current = this.max;
        }
    }

    public setCurrentHealth(currentHealth: number): void {
        this.current = Math.max(0, Math.min(this.max, currentHealth));
        if (this.current <= 0 && !this.isDead) {
            this.isDead = true;
        }
    }

    public setRegeneration(regeneration: number): void {
        this.regeneration = regeneration;
    }

    public setInvulnerabilityTime(time: number): void {
        this.invulnerabilityTime = time;
    }

    public setDeathDelay(delay: number): void {
        this.deathDelay = delay;
    }

    public getHealthPercentage(): number {
        return (this.current / this.max) * 100;
    }

    public isAtFullHealth(): boolean {
        return this.current >= this.max;
    }

    public isAtLowHealth(): boolean {
        return this.current <= this.max * 0.25;
    }

    public isAtCriticalHealth(): boolean {
        return this.current <= this.max * 0.1;
    }

    public takeDamage(damage: number): void {
        if (this.isDead || this.isInvulnerable || this.invulnerabilityTimer > 0) {
            return;
        }

        this.current = Math.max(0, this.current - damage);
        
        if (this.onDamage) {
            this.onDamage(damage);
        }

        if (this.current <= 0) {
            this.isDead = true;
            if (this.onDeath) {
                this.onDeath();
            }
        } else if (this.invulnerabilityTime > 0) {
            this.invulnerabilityTimer = this.invulnerabilityTime;
        }
    }

    public heal(amount: number): void {
        if (this.isDead) return;

        this.current = Math.min(this.max, this.current + amount);
        
        if (this.onHeal) {
            this.onHeal(amount);
        }
    }

    public healToFull(): void {
        this.heal(this.max - this.current);
    }

    public revive(healthPercentage: number = 0.5): void {
        this.isDead = false;
        this.current = this.max * healthPercentage;
        this.invulnerabilityTimer = this.invulnerabilityTime;
    }

    public setInvulnerable(invulnerable: boolean): void {
        this.isInvulnerable = invulnerable;
    }

    public updateInvulnerability(deltaTime: number): void {
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer -= deltaTime;
        }
    }

    public isInvulnerableNow(): boolean {
        return this.isInvulnerable || this.invulnerabilityTimer > 0;
    }

    public getRemainingInvulnerabilityTime(): number {
        return Math.max(0, this.invulnerabilityTimer);
    }

    public setOnDeath(callback: () => void): void {
        this.onDeath = callback;
    }

    public setOnDamage(callback: (damage: number) => void): void {
        this.onDamage = callback;
    }

    public setOnHeal(callback: (amount: number) => void): void {
        this.onHeal = callback;
    }

    public reset(): void {
        this.current = this.max;
        this.isDead = false;
        this.invulnerabilityTimer = 0;
    }
}
