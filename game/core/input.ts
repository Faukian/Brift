/**
 * InputManager handles keyboard and mouse input
 * Enhanced with debug controls and better key management
 */

import { DEBUG_MODE } from '../constants.js';

export class InputManager {
    private keys: Map<string, boolean>;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private mousePressed: boolean = false;
    private debugMode: boolean = DEBUG_MODE;

    constructor() {
        this.keys = new Map();
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Keyboard events
        document.addEventListener('keydown', (event) => {
            this.keys.set(event.code, true);
            
            // Debug controls
            if (this.debugMode) {
                this.handleDebugInput(event);
            }
        });

        document.addEventListener('keyup', (event) => {
            this.keys.set(event.code, false);
        });

        // Mouse events
        document.addEventListener('mousemove', (event) => {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        });

        document.addEventListener('mousedown', () => {
            this.mousePressed = true;
        });

        document.addEventListener('mouseup', () => {
            this.mousePressed = false;
        });

        // Prevent context menu on right click
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
    }

    private handleDebugInput(event: KeyboardEvent): void {
        switch (event.code) {
            case 'F1':
                event.preventDefault();
                this.toggleDebugMode();
                break;
            case 'F2':
                event.preventDefault();
                this.logGameState();
                break;
            case 'F3':
                event.preventDefault();
                this.resetPerformance();
                break;
        }
    }

    public isKeyPressed(keyCode: string): boolean {
        return this.keys.get(keyCode) || false;
    }

    public isKeyJustPressed(keyCode: string): boolean {
        // This would need to be implemented with a "just pressed" state
        // For now, just return the current state
        return this.keys.get(keyCode) || false;
    }

    public getMousePosition(): { x: number; y: number } {
        return { x: this.mouseX, y: this.mouseY };
    }

    public isMousePressed(): boolean {
        return this.mousePressed;
    }

    public toggleDebugMode(): void {
        this.debugMode = !this.debugMode;
        console.log(`Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
        
        // Toggle debug canvas visibility
        const debugCanvas = document.getElementById('debug-canvas');
        if (debugCanvas) {
            debugCanvas.style.display = this.debugMode ? 'block' : 'none';
        }
    }

    public isDebugMode(): boolean {
        return this.debugMode;
    }

    private logGameState(): void {
        console.log('=== GAME STATE ===');
        console.log('Active keys:', Array.from(this.keys.entries()).filter(([_, pressed]) => pressed));
        console.log('Mouse position:', this.getMousePosition());
        console.log('Mouse pressed:', this.mousePressed);
        console.log('Debug mode:', this.debugMode);
    }

    private resetPerformance(): void {
        // This would reset performance counters
        console.log('Performance counters reset');
    }

    public getPressedKeys(): string[] {
        return Array.from(this.keys.entries())
            .filter(([_, pressed]) => pressed)
            .map(([key, _]) => key);
    }
}
