/**
 * Projectile entity factory for assembling projectile components
 * Creates projectile entities with all necessary components
 */

import { World } from '../core/ecs/world.js';
import { Position } from '../components/position.js';
import { Velocity } from '../components/velocity.js';
import { Sprite } from '../components/sprite.js';
import { Damage } from '../components/damage.js';

export class ProjectileFactory {
    private world: World;

    constructor(world: World) {
        this.world = world;
    }

    public createProjectile(x: number, y: number, targetX: number, targetY: number, type: string = 'arrow'): number {
        const entity = this.world.createEntity();
        const entityId = entity.getId();

        // Add position component
        const position = new Position(entityId, x, y);
        this.world.addComponent(entityId, position);

        // Add velocity component
        const velocity = new Velocity(entityId);
        this.world.addComponent(entityId, velocity);

        // Add sprite component
        const sprite = new Sprite(entityId, 'circle');
        this.world.addComponent(entityId, sprite);

        // Add damage component
        const damage = new Damage(entityId);
        this.world.addComponent(entityId, damage);

        // Configure based on projectile type
        this.configureProjectileType(entityId, type, x, y, targetX, targetY);

        console.log(`Created ${type} projectile entity ${entityId}`);
        return entityId;
    }

    private configureProjectileType(entityId: number, type: string, startX: number, startY: number, targetX: number, targetY: number): void {
        const entity = this.world.getEntity(entityId);
        if (!entity) return;

        const sprite = entity.getComponent('sprite') as Sprite;
        const velocity = entity.getComponent('velocity') as Velocity;
        const damage = entity.getComponent('damage') as Damage;

        switch (type) {
            case 'arrow':
                this.configureArrow(sprite, velocity, damage, startX, startY, targetX, targetY);
                break;
            case 'fireball':
                this.configureFireball(sprite, velocity, damage, startX, startY, targetX, targetY);
                break;
            case 'lightning':
                this.configureLightning(sprite, velocity, damage, startX, startY, targetX, targetY);
                break;
            case 'bullet':
                this.configureBullet(sprite, velocity, damage, startX, startY, targetX, targetY);
                break;
            default:
                console.log(`Unknown projectile type: ${type}, using arrow configuration`);
                this.configureArrow(sprite, velocity, damage, startX, startY, targetX, targetY);
        }
    }

    private configureArrow(sprite: Sprite, velocity: Velocity, damage: Damage, startX: number, startY: number, targetX: number, targetY: number): void {
        sprite.setCircle(4, '#8B4513');
        sprite.setLayer(8);
        
        damage.setBaseDamage(20);
        damage.setDamageType('physical');
        damage.setPenetration(5);
        
        const speed = 300;
        const angle = Math.atan2(targetY - startY, targetX - startX);
        velocity.setSpeed(speed, angle);
        velocity.setMaxSpeed(speed);
        velocity.setFriction(0.99); // Very low friction for arrows
    }

    private configureFireball(sprite: Sprite, velocity: Velocity, damage: Damage, startX: number, startY: number, targetX: number, targetY: number): void {
        sprite.setCircle(8, '#FF4500');
        sprite.setLayer(8);
        
        damage.setBaseDamage(35);
        damage.setDamageType('fire');
        damage.setAreaDamage(15, 40);
        
        const speed = 200;
        const angle = Math.atan2(targetY - startY, targetX - startX);
        velocity.setSpeed(speed, angle);
        velocity.setMaxSpeed(speed);
        velocity.setFriction(0.98);
    }

    private configureLightning(sprite: Sprite, velocity: Velocity, damage: Damage, startX: number, startY: number, targetX: number, targetY: number): void {
        sprite.setCircle(6, '#00FFFF');
        sprite.setLayer(8);
        
        damage.setBaseDamage(30);
        damage.setDamageType('lightning');
        damage.setChainCount(3);
        damage.setChainRange(60);
        
        const speed = 400;
        const angle = Math.atan2(targetY - startY, targetX - startX);
        velocity.setSpeed(speed, angle);
        velocity.setMaxSpeed(speed);
        velocity.setFriction(0.97);
    }

    private configureBullet(sprite: Sprite, velocity: Velocity, damage: Damage, startX: number, startY: number, targetX: number, targetY: number): void {
        sprite.setCircle(3, '#FFD700');
        sprite.setLayer(8);
        
        damage.setBaseDamage(25);
        damage.setDamageType('physical');
        damage.setPenetration(15);
        
        const speed = 500;
        const angle = Math.atan2(targetY - startY, targetX - startX);
        velocity.setSpeed(speed, angle);
        velocity.setMaxSpeed(speed);
        velocity.setFriction(0.995);
    }

    public createHomingProjectile(x: number, y: number, targetEntityId: number, type: string = 'arrow'): number {
        const entity = this.world.createEntity();
        const entityId = entity.getId();

        // Add position component
        const position = new Position(entityId, x, y);
        this.world.addComponent(entityId, position);

        // Add velocity component
        const velocity = new Velocity(entityId);
        this.world.addComponent(entityId, velocity);

        // Add sprite component
        const sprite = new Sprite(entityId, 'circle');
        this.world.addComponent(entityId, sprite);

        // Add damage component
        const damage = new Damage(entityId);
        this.world.addComponent(entityId, damage);

        // Configure homing behavior
        this.configureHomingProjectile(entityId, type, targetEntityId);

        console.log(`Created homing ${type} projectile entity ${entityId}`);
        return entityId;
    }

    private configureHomingProjectile(entityId: number, type: string, targetEntityId: number): void {
        const entity = this.world.getEntity(entityId);
        if (!entity) return;

        const sprite = entity.getComponent('sprite') as Sprite;
        const velocity = entity.getComponent('velocity') as Velocity;
        const damage = entity.getComponent('damage') as Damage;

        // Configure sprite and damage based on type
        switch (type) {
            case 'arrow':
                sprite.setCircle(4, '#8B4513');
                damage.setBaseDamage(20);
                damage.setDamageType('physical');
                break;
            case 'fireball':
                sprite.setCircle(8, '#FF4500');
                damage.setBaseDamage(35);
                damage.setDamageType('fire');
                break;
            default:
                sprite.setCircle(4, '#8B4513');
                damage.setBaseDamage(20);
                damage.setDamageType('physical');
        }

        sprite.setLayer(8);
        
        // Set initial velocity (will be updated by homing system)
        velocity.setMaxSpeed(250);
        velocity.setFriction(0.99);
        
        // Store target entity ID for homing logic
        (entity as any).targetEntityId = targetEntityId;
    }

    public createAreaProjectile(x: number, y: number, targetX: number, targetY: number, type: string = 'grenade'): number {
        const entity = this.world.createEntity();
        const entityId = entity.getId();

        // Add position component
        const position = new Position(entityId, x, y);
        this.world.addComponent(entityId, position);

        // Add velocity component
        const velocity = new Velocity(entityId);
        this.world.addComponent(entityId, velocity);

        // Add sprite component
        const sprite = new Sprite(entityId, 'circle');
        this.world.addComponent(entityId, sprite);

        // Add damage component
        const damage = new Damage(entityId);
        this.world.addComponent(entityId, damage);

        // Configure area projectile
        this.configureAreaProjectile(entityId, type, x, y, targetX, targetY);

        console.log(`Created area ${type} projectile entity ${entityId}`);
        return entityId;
    }

    private configureAreaProjectile(entityId: number, type: string, startX: number, startY: number, targetX: number, targetY: number): void {
        const entity = this.world.getEntity(entityId);
        if (!entity) return;

        const sprite = entity.getComponent('sprite') as Sprite;
        const velocity = entity.getComponent('velocity') as Velocity;
        const damage = entity.getComponent('damage') as Damage;

        switch (type) {
            case 'grenade':
                sprite.setCircle(6, '#228B22');
                damage.setBaseDamage(40);
                damage.setAreaDamage(30, 80);
                break;
            case 'bomb':
                sprite.setCircle(10, '#000000');
                damage.setBaseDamage(60);
                damage.setAreaDamage(50, 120);
                break;
            case 'mine':
                sprite.setCircle(8, '#FF0000');
                damage.setBaseDamage(50);
                damage.setAreaDamage(40, 100);
                break;
            default:
                sprite.setCircle(6, '#228B22');
                damage.setBaseDamage(40);
                damage.setAreaDamage(30, 80);
        }

        sprite.setLayer(8);
        damage.setDamageType('physical');
        
        const speed = 150;
        const angle = Math.atan2(targetY - startY, targetX - startX);
        velocity.setSpeed(speed, angle);
        velocity.setMaxSpeed(speed);
        velocity.setFriction(0.95);
        
        // Add explosion timer for area projectiles
        (entity as any).explosionTimer = 2.0; // 2 seconds to explosion
    }

    public getProjectileStats(entityId: number): any {
        const entity = this.world.getEntity(entityId);
        if (!entity) return null;

        const position = entity.getComponent('position') as Position;
        const velocity = entity.getComponent('velocity') as Velocity;
        const damage = entity.getComponent('damage') as Damage;

        return {
            id: entityId,
            position: position ? { x: position.x, y: position.y } : null,
            velocity: velocity ? { x: velocity.x, y: velocity.y, speed: velocity.getSpeed() } : null,
            damage: damage ? { base: damage.baseDamage, type: damage.damageType } : null
        };
    }
}
