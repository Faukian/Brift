/**
 * Resource component stores resource collection data
 * Pure data component with no logic
 */

import { Component } from '../core/ecs/component.js';

export class Resource extends Component {
    public type: string;
    public amount: number;
    public maxAmount: number;
    public canCollect: boolean;
    public collectionTimer: number;
    public collectionInterval: number;
    public collectionRange: number;
    public respawnTime: number;
    public respawnTimer: number;
    public quality: number; // 0-1, affects amount and value
    public isDepleted: boolean;
    public onCollected?: () => void;
    public onRespawned?: () => void;

    constructor(entityId: number, type: string = 'gold', amount: number = 10) {
        super('resource', entityId);
        this.type = type;
        this.amount = amount;
        this.maxAmount = amount;
        this.canCollect = true;
        this.collectionTimer = 0;
        this.collectionInterval = 1.0;
        this.collectionRange = 50;
        this.respawnTime = 30;
        this.respawnTimer = 0;
        this.quality = 1.0;
        this.isDepleted = false;
    }

    public clone(): Component {
        const cloned = new Resource(this.entityId, this.type, this.amount);
        cloned.maxAmount = this.maxAmount;
        cloned.canCollect = this.canCollect;
        cloned.collectionTimer = this.collectionTimer;
        cloned.collectionInterval = this.collectionInterval;
        cloned.collectionRange = this.collectionRange;
        cloned.respawnTime = this.respawnTime;
        cloned.respawnTimer = this.respawnTimer;
        cloned.quality = this.quality;
        cloned.isDepleted = this.isDepleted;
        return cloned;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public setAmount(amount: number): void {
        this.amount = Math.max(0, amount);
        this.maxAmount = Math.max(this.maxAmount, this.amount);
        this.isDepleted = this.amount <= 0;
    }

    public setMaxAmount(maxAmount: number): void {
        this.maxAmount = Math.max(0, maxAmount);
        if (this.amount > this.maxAmount) {
            this.amount = this.maxAmount;
        }
    }

    public setCollectionInterval(interval: number): void {
        this.collectionInterval = Math.max(0, interval);
    }

    public setCollectionRange(range: number): void {
        this.collectionRange = Math.max(0, range);
    }

    public setRespawnTime(time: number): void {
        this.respawnTime = Math.max(0, time);
    }

    public setQuality(quality: number): void {
        this.quality = Math.max(0, Math.min(1, quality));
    }

    public canBeCollected(): boolean {
        return this.canCollect && !this.isDepleted && this.collectionTimer <= 0;
    }

    public collect(): number {
        if (!this.canBeCollected()) return 0;

        const collectedAmount = Math.floor(this.amount * this.quality);
        this.amount = Math.max(0, this.amount - collectedAmount);
        
        if (this.amount <= 0) {
            this.isDepleted = true;
            this.respawnTimer = this.respawnTime;
        } else {
            this.collectionTimer = this.collectionInterval;
        }

        if (this.onCollected) {
            this.onCollected();
        }

        return collectedAmount;
    }

    public canRespawn(): boolean {
        return this.isDepleted && this.respawnTimer <= 0;
    }

    public respawn(): void {
        if (!this.canRespawn()) return;

        this.amount = this.maxAmount;
        this.isDepleted = false;
        this.collectionTimer = 0;

        if (this.onRespawned) {
            this.onRespawned();
        }
    }

    public updateRespawnTimer(deltaTime: number): void {
        if (this.respawnTimer > 0) {
            this.respawnTimer -= deltaTime;
        }
    }

    public getRespawnProgress(): number {
        if (this.respawnTime <= 0) return 100;
        return Math.max(0, Math.min(100, (1 - this.respawnTimer / this.respawnTime) * 100));
    }

    public getCollectionProgress(): number {
        if (this.collectionInterval <= 0) return 100;
        return Math.max(0, Math.min(100, (1 - this.collectionTimer / this.collectionInterval) * 100));
    }

    public setOnCollected(callback: () => void): void {
        this.onCollected = callback;
    }

    public setOnRespawned(callback: () => void): void {
        this.onRespawned = callback;
    }

    public reset(): void {
        this.amount = this.maxAmount;
        this.isDepleted = false;
        this.collectionTimer = 0;
        this.respawnTimer = 0;
    }

    public getValue(): number {
        // Calculate resource value based on type, amount, and quality
        const baseValues: { [key: string]: number } = {
            'gold': 1,
            'wood': 0.5,
            'stone': 0.8,
            'iron': 1.2,
            'crystal': 2.0,
            'experience': 0.1
        };

        const baseValue = baseValues[this.type] || 1;
        return this.amount * baseValue * this.quality;
    }
}
