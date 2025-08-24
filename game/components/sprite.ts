/**
 * Sprite component stores visual representation data
 * Simple data component for the demo
 */

import { Component } from '../core/ecs/component.js';

export class Sprite extends Component {
    public color: string;
    public width: number;
    public height: number;

    constructor(entityId: number, color: string = '#ffffff', width: number = 32, height: number = 32) {
        super('sprite', entityId);
        this.color = color;
        this.width = width;
        this.height = height;
    }

    public clone(): Component {
        return new Sprite(this.entityId, this.color, this.width, this.height);
    }
}
