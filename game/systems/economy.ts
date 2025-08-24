/**
 * EconomySystem handles resources, money, upgrades, and economic game mechanics
 * Manages player economy, resource flow, and upgrade costs
 */

import { System } from '../core/ecs/system.js';
import { Entity } from '../core/ecs/entity.js';
import { World } from '../core/ecs/world.js';

export class EconomySystem extends System {
    private playerResources: Map<string, number>;
    private upgradeCosts: Map<string, any>;
    private resourceGenerationRates: Map<string, number>;

    constructor(world: World) {
        super(world, ['resource'], 20); // Lower priority
        this.playerResources = new Map();
        this.upgradeCosts = new Map();
        this.resourceGenerationRates = new Map();
        
        this.initializeEconomy();
    }

    private initializeEconomy(): void {
        // Initialize starting resources
        this.playerResources.set('gold', 1000);
        this.playerResources.set('wood', 500);
        this.playerResources.set('stone', 300);
        this.playerResources.set('experience', 0);

        // Initialize resource generation rates
        this.resourceGenerationRates.set('gold', 10); // per second
        this.resourceGenerationRates.set('wood', 5);
        this.resourceGenerationRates.set('stone', 3);
        this.resourceGenerationRates.set('experience', 1);

        // Initialize upgrade costs
        this.initializeUpgradeCosts();
    }

    private initializeUpgradeCosts(): void {
        // Tower upgrades
        this.upgradeCosts.set('tower_damage', {
            gold: 100,
            wood: 50,
            stone: 25,
            experience: 10
        });

        this.upgradeCosts.set('tower_range', {
            gold: 150,
            wood: 75,
            stone: 40,
            experience: 15
        });

        this.upgradeCosts.set('tower_speed', {
            gold: 200,
            wood: 100,
            stone: 50,
            experience: 20
        });

        // Building upgrades
        this.upgradeCosts.set('building_level', {
            gold: 300,
            wood: 150,
            stone: 100,
            experience: 25
        });

        this.upgradeCosts.set('building_efficiency', {
            gold: 250,
            wood: 125,
            stone: 75,
            experience: 20
        });

        // Player upgrades
        this.upgradeCosts.set('player_health', {
            gold: 500,
            wood: 200,
            stone: 150,
            experience: 50
        });

        this.upgradeCosts.set('player_speed', {
            gold: 400,
            wood: 150,
            stone: 100,
            experience: 40
        });
    }

    public update(deltaTime: number, entities: Entity[]): void {
        const deltaSeconds = deltaTime / 1000;

        // Update passive resource generation
        this.updatePassiveGeneration(deltaSeconds);

        // Update resource entities
        for (const entity of entities) {
            this.updateResourceEntity(entity, deltaSeconds);
        }
    }

    private updatePassiveGeneration(deltaSeconds: number): void {
        // Generate passive resources over time
        for (const [resourceType, rate] of this.resourceGenerationRates) {
            const currentAmount = this.playerResources.get(resourceType) || 0;
            const generated = rate * deltaSeconds;
            this.playerResources.set(resourceType, currentAmount + generated);
        }
    }

    private updateResourceEntity(entity: Entity, deltaSeconds: number): void {
        const resource = entity.getComponent('resource');
        if (!resource) return;

        // Update resource collection timer
        if (resource.collectionTimer > 0) {
            resource.collectionTimer -= deltaSeconds;
        }

        // Check if resource can be collected
        if (resource.collectionTimer <= 0 && resource.canCollect) {
            this.collectResource(entity, resource);
        }
    }

    private collectResource(entity: Entity, resource: any): void {
        const resourceType = resource.type;
        const amount = resource.amount;

        // Add to player resources
        const currentAmount = this.playerResources.get(resourceType) || 0;
        this.playerResources.set(resourceType, currentAmount + amount);

        // Reset collection timer
        resource.collectionTimer = resource.collectionInterval;

        // Trigger collection effects
        this.triggerResourceCollection(entity, resource);

        console.log(`Collected ${amount} ${resourceType}`);
    }

    private triggerResourceCollection(entity: Entity, resource: any): void {
        // This would trigger visual effects, sounds, etc.
        // For now, just log the collection
    }

    public getResourceAmount(resourceType: string): number {
        return this.playerResources.get(resourceType) || 0;
    }

    public addResource(resourceType: string, amount: number): void {
        const currentAmount = this.playerResources.get(resourceType) || 0;
        this.playerResources.set(resourceType, currentAmount + amount);
    }

    public spendResource(resourceType: string, amount: number): boolean {
        const currentAmount = this.playerResources.get(resourceType) || 0;
        
        if (currentAmount >= amount) {
            this.playerResources.set(resourceType, currentAmount - amount);
            return true;
        }
        
        return false;
    }

    public canAffordUpgrade(upgradeType: string): boolean {
        const costs = this.upgradeCosts.get(upgradeType);
        if (!costs) return false;

        for (const [resourceType, cost] of Object.entries(costs)) {
            const currentAmount = this.playerResources.get(resourceType) || 0;
            if (currentAmount < cost) {
                return false;
            }
        }

        return true;
    }

    public purchaseUpgrade(upgradeType: string): boolean {
        if (!this.canAffordUpgrade(upgradeType)) {
            return false;
        }

        const costs = this.upgradeCosts.get(upgradeType);
        if (!costs) return false;

        // Spend resources
        for (const [resourceType, cost] of Object.entries(costs)) {
            this.spendResource(resourceType, cost);
        }

        // Apply upgrade effects
        this.applyUpgrade(upgradeType);

        console.log(`Purchased upgrade: ${upgradeType}`);
        return true;
    }

    private applyUpgrade(upgradeType: string): void {
        // This would apply the actual upgrade effects to the game
        // For now, just log the upgrade
        console.log(`Applied upgrade: ${upgradeType}`);
    }

    public getUpgradeCost(upgradeType: string): any {
        return this.upgradeCosts.get(upgradeType) || null;
    }

    public getAllUpgradeCosts(): Map<string, any> {
        return new Map(this.upgradeCosts);
    }

    public getResourceGenerationRate(resourceType: string): number {
        return this.resourceGenerationRates.get(resourceType) || 0;
    }

    public setResourceGenerationRate(resourceType: string, rate: number): void {
        this.resourceGenerationRates.set(resourceType, rate);
    }

    public boostResourceGeneration(resourceType: string, multiplier: number, duration: number): void {
        const currentRate = this.resourceGenerationRates.get(resourceType) || 0;
        const boostedRate = currentRate * multiplier;
        
        this.resourceGenerationRates.set(resourceType, boostedRate);

        // Reset to normal rate after duration
        setTimeout(() => {
            this.resourceGenerationRates.set(resourceType, currentRate);
        }, duration * 1000);
    }

    public getTotalResources(): number {
        let total = 0;
        for (const amount of this.playerResources.values()) {
            total += amount;
        }
        return total;
    }

    public getResourceBreakdown(): Map<string, number> {
        return new Map(this.playerResources);
    }

    public saveEconomyState(): any {
        return {
            resources: Object.fromEntries(this.playerResources),
            upgradeCosts: Object.fromEntries(this.upgradeCosts),
            resourceGenerationRates: Object.fromEntries(this.resourceGenerationRates)
        };
    }

    public loadEconomyState(state: any): void {
        if (state.resources) {
            this.playerResources = new Map(Object.entries(state.resources));
        }
        
        if (state.upgradeCosts) {
            this.upgradeCosts = new Map(Object.entries(state.upgradeCosts));
        }
        
        if (state.resourceGenerationRates) {
            this.resourceGenerationRates = new Map(Object.entries(state.resourceGenerationRates));
        }
    }

    public resetEconomy(): void {
        this.initializeEconomy();
    }

    public addResourceBonus(resourceType: string, bonus: number, duration: number): void {
        const currentRate = this.resourceGenerationRates.get(resourceType) || 0;
        this.resourceGenerationRates.set(resourceType, currentRate + bonus);

        // Remove bonus after duration
        setTimeout(() => {
            const currentRate = this.resourceGenerationRates.get(resourceType) || 0;
            this.resourceGenerationRates.set(resourceType, Math.max(0, currentRate - bonus));
        }, duration * 1000);
    }

    public calculateUpgradeEfficiency(upgradeType: string): number {
        const costs = this.upgradeCosts.get(upgradeType);
        if (!costs) return 0;

        // Calculate efficiency based on cost vs benefit
        // This is a simplified calculation - in practice, you'd want more sophisticated logic
        const totalCost = Object.values(costs).reduce((sum: number, cost: any) => sum + cost, 0);
        const baseEfficiency = 1000 / totalCost; // Higher efficiency for lower costs

        return Math.min(100, Math.max(0, baseEfficiency));
    }

    public getRecommendedUpgrades(): string[] {
        const recommendations: string[] = [];
        const upgradeTypes = Array.from(this.upgradeCosts.keys());

        // Sort upgrades by efficiency
        upgradeTypes.sort((a, b) => {
            const efficiencyA = this.calculateUpgradeEfficiency(a);
            const efficiencyB = this.calculateUpgradeEfficiency(b);
            return efficiencyB - efficiencyA;
        });

        // Return top 3 recommendations
        return upgradeTypes.slice(0, 3);
    }
}
