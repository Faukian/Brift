/**
 * Velocity component stores entity movement data
 * Simple data component for the demo
 */

import { Component } from '../core/ecs/component.js';

export class Velocity extends Component {
    public dx: number;
    public dy: number;

    constructor(entityId: number, dx: number = 0, dy: number = 0) {
        super('velocity', entityId);
        this.dx = dx;
        this.dy = dy;
    }

    public clone(): Component {
        return new Velocity(this.entityId, this.dx, this.dy);
    }
}
