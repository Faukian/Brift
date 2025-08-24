/**
 * Utility functions for math, random numbers, and geometry
 * Common helper functions used throughout the game
 */

export class MathUtils {
    /**
     * Clamp a value between min and max
     */
    public static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    /**
     * Linear interpolation between two values
     */
    public static lerp(start: number, end: number, factor: number): number {
        return start + (end - start) * factor;
    }

    /**
     * Calculate distance between two points
     */
    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Calculate squared distance (faster than distance for comparisons)
     */
    public static distanceSquared(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    }

    /**
     * Convert degrees to radians
     */
    public static toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Convert radians to degrees
     */
    public static toDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    /**
     * Calculate angle between two points
     */
    public static angleBetween(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    /**
     * Check if a point is within a circle
     */
    public static pointInCircle(px: number, py: number, cx: number, cy: number, radius: number): boolean {
        return this.distanceSquared(px, py, cx, cy) <= radius * radius;
    }

    /**
     * Check if a point is within a rectangle
     */
    public static pointInRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    }
}

export class RandomUtils {
    private static seed: number = Date.now();

    /**
     * Set random seed for reproducible randomness
     */
    public static setSeed(seed: number): void {
        this.seed = seed;
    }

    /**
     * Generate random float between 0 and 1
     */
    public static random(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    /**
     * Generate random float between min and max
     */
    public static randomRange(min: number, max: number): number {
        return min + this.random() * (max - min);
    }

    /**
     * Generate random integer between min and max (inclusive)
     */
    public static randomInt(min: number, max: number): number {
        return Math.floor(this.randomRange(min, max + 1));
    }

    /**
     * Choose random element from array
     */
    public static randomChoice<T>(array: T[]): T {
        return array[this.randomInt(0, array.length - 1)];
    }

    /**
     * Generate random point within a circle
     */
    public static randomPointInCircle(centerX: number, centerY: number, radius: number): { x: number; y: number } {
        const angle = this.random() * Math.PI * 2;
        const r = Math.sqrt(this.random()) * radius;
        return {
            x: centerX + r * Math.cos(angle),
            y: centerY + r * Math.sin(angle)
        };
    }
}

export class GeometryUtils {
    /**
     * Check if two circles intersect
     */
    public static circlesIntersect(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): boolean {
        const distance = MathUtils.distance(x1, y1, x2, y2);
        return distance <= r1 + r2;
    }

    /**
     * Check if two rectangles intersect
     */
    public static rectsIntersect(x1: number, y1: number, w1: number, h1: number,
                                x2: number, y2: number, w2: number, h2: number): boolean {
        return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
    }

    /**
     * Get intersection point of two lines (if they intersect)
     */
    public static lineIntersection(x1: number, y1: number, x2: number, y2: number,
                                  x3: number, y3: number, x4: number, y4: number): { x: number; y: number } | null {
        const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (Math.abs(denom) < 0.0001) return null;

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;

        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: x1 + t * (x2 - x1),
                y: y1 + t * (y2 - y1)
            };
            }
        return null;
    }
}

export class DataUtils {
    /**
     * Load JSON configuration file asynchronously
     */
    public static async loadJSON<T>(path: string): Promise<T> {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load JSON: ${response.status} ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading JSON from ${path}:`, error);
            throw error;
        }
    }

    /**
     * Load JSON configuration file with fallback to default values
     */
    public static async loadJSONWithFallback<T>(path: string, fallback: T): Promise<T> {
        try {
            return await this.loadJSON<T>(path);
        } catch (error) {
            console.warn(`Using fallback values for ${path}:`, fallback);
            return fallback;
        }
    }
}
