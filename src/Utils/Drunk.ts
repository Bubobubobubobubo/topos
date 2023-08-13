export class DrunkWalk {

    /**
     * A class that implements a "drunk walk" algorithm. This is useful for generating random
     * numbers in a constrained range. The "drunk" starts at a position, and then makes a step
     * of +1, 0, or -1. The "drunk" can be constrained to a range, and can wrap around the range.
     * 
     * @param min - The minimum value of the range
     * @param max - The maximum value of the range
     * @param wrap - Whether or not the "drunk" should wrap around the range
     * @param position - The starting/current position of the "drunk"
     */

    public min: number;
    public max: number;
    private wrap: boolean;
    public position: number;

    constructor(min: number, max: number, wrap: boolean) {
        this.min = min;
        this.max = max;
        this.wrap = wrap;
        this.position = 0;
    }

    step(): void {

        /**
         * Makes a step in the "drunk walk" algorithm. This is a random step of +1, 0, or -1.
         */

        const stepSize: number = Math.floor(Math.random() * 3) - 1;
        this.position += stepSize;

        if (this.wrap) {
            if (this.position > this.max) {
                this.position = this.min;
            } else if (this.position < this.min) {
                this.position = this.max;
            }
        } else {
            if (this.position < this.min) {
                this.position = this.min;
            } else if (this.position > this.max) {
                this.position = this.max;
            }
        }
    }

    getPosition(): number {
        /**
         * @returns The current position of the "drunk"
         */
        return this.position;
    }

    toggleWrap(b: boolean): void {
        /**
         * Whether or not the "drunk" should wrap around the range
         * 
         * @param b - Whether or not the "drunk" should wrap around the range
         */
        this.wrap = b;
    }
}