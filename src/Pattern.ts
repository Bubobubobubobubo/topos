export class Pattern {

    events: Event[];
    _current : Event | undefined = undefined;

    constructor(values: number[]) {
        this.events = values.map((value, index) => new Event(value));
        this.buildLinks();
    }

    // Create links cyclic links between events
    buildLinks(): void {
        this.events.forEach((event, index) => {
            event._next = index < this.events.length - 1 ? this.events[index + 1] : this.events[0];
        });
    }

    // Get the current event for this pattern
    current(): Event {
        if(this._current) this._current = this._current.next();
        else this._current = this.events[0];
        return this._current;
    }
}


export class Event {
    /**
     * Simple Event class with simple numerical value and link to next event
     */
    _next!: Event;
    _value: number;
    // Used to store a modified version of the event
    modifiedEvent: Event | undefined = undefined;
    
    constructor(value: number) {
        this._value = value;
    }

    get value(): number {
        if(this.modifiedEvent) return this.modifiedEvent._value;
        return this._value;
    }

    add(value: number): Event {
        if(!this.modifiedEvent) this.modifiedEvent = this.clone();
        this.modifiedEvent._value += value;
        return this;
    }

    next() {
        if(this.modifiedEvent) {
            const next = this.modifiedEvent._next;
            // Set modifiedEvent to undefined, cos we dont want to apply methods to earlier modified events
            this.modifiedEvent = undefined;
            return next;
        }
        return this._next;
    }

    clone(): Event {
        const event = new Event(this._value);
        event._next = this._next;
        return event;
    }
}

// Simple cache for patterns
let cache = new Map<string, Pattern>();

// Create a cache key from the values of a pattern somehow
const createCacheKey = (values: number[]) => values.join('-');

// Get a cached pattern or create a new one
const getCachedPattern = (values: number[]) => {
    const key = createCacheKey(values);
    const cachedPattern = cache.get(key);
    if(cachedPattern) return cachedPattern;
    const newPattern = new Pattern(values);
    cache.set(key, newPattern);
    return newPattern;
}

// Cached event function that includes the main logic
const cachedEvent = (values: number[]): Event => {
    const pattern = getCachedPattern(values);
    if(pattern._current) { console.log("Play: ", pattern._current.value) }
    else { console.log("Current is undefined so just starting!") }
    return pattern.current();
}

// Test it out

let i = 0;
while(true) {

    cachedEvent([1, 2, 3]).add(1).add(-2);

    if(i++>10) break;
    
}