/**
 * BuildingStats component stores building-specific data
 * Pure data component with no logic
 */

import { Component } from '../core/ecs/component.js';

export class BuildingStats extends Component {
    public type: string;
    public level: number;
    public isUnderConstruction: boolean;
    public constructionProgress: number;
    public constructionTime: number;
    public constructionSpeed: number;
    public isOperational: boolean;
    public efficiency: number;
    public health?: any; // Health component reference
    public autoRepair: boolean;
    public repairRate: number;
    public placementRadius: number;
    public threatDetectionRange: number;
    public defenseActive: boolean;
    public defenseCooldown: number;
    public defenseCooldownMax: number;
    public upgrades?: Map<string, any>;
    public appliedUpgrades: string[];

    // Resource generator specific
    public resourceType?: string;
    public resourceGenerationAmount?: number;
    public resourceGenerationInterval?: number;
    public resourceGenerationTimer?: number;
    public lastResourceGeneration?: number;

    // Storage specific
    public storageCapacity?: number;
    public currentStorage?: number;
    public storageItems?: any[];

    // Workshop specific
    public workSpeed?: number;
    public currentProject?: any;
    public projectProgress?: number;

    constructor(entityId: number, type: string = 'basic') {
        super('buildingStats', entityId);
        this.type = type;
        this.level = 1;
        this.isUnderConstruction = true;
        this.constructionProgress = 0;
        this.constructionTime = 10;
        this.constructionSpeed = 1;
        this.isOperational = false;
        this.efficiency = 1.0;
        this.autoRepair = false;
        this.repairRate = 1;
        this.placementRadius = 50;
        this.threatDetectionRange = 100;
        this.defenseActive = false;
        this.defenseCooldown = 0;
        this.defenseCooldownMax = 5;
        this.appliedUpgrades = [];
    }

    public clone(): Component {
        const cloned = new BuildingStats(this.entityId, this.type);
        cloned.level = this.level;
        cloned.isUnderConstruction = this.isUnderConstruction;
        cloned.constructionProgress = this.constructionProgress;
        cloned.constructionTime = this.constructionTime;
        cloned.constructionSpeed = this.constructionSpeed;
        cloned.isOperational = this.isOperational;
        cloned.efficiency = this.efficiency;
        cloned.autoRepair = this.autoRepair;
        cloned.repairRate = this.repairRate;
        cloned.placementRadius = this.placementRadius;
        cloned.threatDetectionRange = this.threatDetectionRange;
        cloned.defenseActive = this.defenseActive;
        cloned.defenseCooldown = this.defenseCooldown;
        cloned.defenseCooldownMax = this.defenseCooldownMax;
        cloned.appliedUpgrades = [...this.appliedUpgrades];
        return cloned;
    }

    public setType(type: string): void {
        this.type = type;
    }

    public setLevel(level: number): void {
        this.level = Math.max(1, level);
    }

    public setConstructionTime(time: number): void {
        this.constructionTime = Math.max(0, time);
    }

    public setConstructionSpeed(speed: number): void {
        this.constructionSpeed = Math.max(0, speed);
    }

    public setEfficiency(efficiency: number): void {
        this.efficiency = Math.max(0, efficiency);
    }

    public setAutoRepair(autoRepair: boolean): void {
        this.autoRepair = autoRepair;
    }

    public setRepairRate(rate: number): void {
        this.repairRate = Math.max(0, rate);
    }

    public setPlacementRadius(radius: number): void {
        this.placementRadius = Math.max(0, radius);
    }

    public setThreatDetectionRange(range: number): void {
        this.threatDetectionRange = Math.max(0, range);
    }

    public getConstructionProgress(): number {
        return (this.constructionProgress / this.constructionTime) * 100;
    }

    public isConstructionComplete(): boolean {
        return this.constructionProgress >= this.constructionTime;
    }

    public canActivateDefense(): boolean {
        return this.defenseActive && this.defenseCooldown <= 0;
    }

    public activateDefense(): void {
        this.defenseCooldown = this.defenseCooldownMax;
    }

    // Resource generator methods
    public setResourceGeneration(type: string, amount: number, interval: number): void {
        this.resourceType = type;
        this.resourceGenerationAmount = amount;
        this.resourceGenerationInterval = interval;
        this.resourceGenerationTimer = 0;
        this.lastResourceGeneration = 0;
    }

    public canGenerateResource(): boolean {
        return this.isOperational && this.resourceGenerationTimer !== undefined && 
               this.resourceGenerationTimer >= (this.resourceGenerationInterval || 0);
    }

    public resetResourceGenerationTimer(): void {
        if (this.resourceGenerationInterval !== undefined) {
            this.resourceGenerationTimer = 0;
        }
    }

    // Storage methods
    public setStorageCapacity(capacity: number): void {
        this.storageCapacity = capacity;
        this.currentStorage = 0;
        this.storageItems = [];
    }

    public canStoreItem(): boolean {
        return this.isOperational && this.currentStorage !== undefined && 
               this.storageCapacity !== undefined && 
               this.currentStorage < this.storageCapacity;
    }

    public addStorageItem(item: any): boolean {
        if (this.canStoreItem() && this.storageItems !== undefined) {
            this.storageItems.push(item);
            this.currentStorage = this.storageItems.length;
            return true;
        }
        return false;
    }

    public removeStorageItem(item: any): boolean {
        if (this.storageItems !== undefined) {
            const index = this.storageItems.indexOf(item);
            if (index > -1) {
                this.storageItems.splice(index, 1);
                this.currentStorage = this.storageItems.length;
                return true;
            }
        }
        return false;
    }

    // Workshop methods
    public setWorkSpeed(speed: number): void {
        this.workSpeed = Math.max(0, speed);
    }

    public setProject(project: any): void {
        this.currentProject = project;
        this.projectProgress = 0;
    }

    public canWorkOnProject(): boolean {
        return this.isOperational && this.currentProject !== null && 
               this.workSpeed !== undefined && this.workSpeed > 0;
    }

    public getProjectProgress(): number {
        if (!this.currentProject) return 0;
        return (this.projectProgress || 0) / this.currentProject.timeRequired * 100;
    }

    public isProjectComplete(): boolean {
        return this.currentProject !== null && 
               this.projectProgress !== undefined && 
               this.projectProgress >= this.currentProject.timeRequired;
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
