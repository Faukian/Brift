/**
 * Position component stores entity coordinates
 * Simple data component for the demo
 */

import { Component } from '../core/ecs/component.js';

export class Position extends Component {
    public x: number;
    public y: number;

    constructor(entityId: number, x: number = 0, y: number = 0) {
        super('position', entityId);
        this.x = x;
        this.y = y;
    }

    public clone(): Component {
        return new Position(this.entityId, this.x, this.y);
    }
}
