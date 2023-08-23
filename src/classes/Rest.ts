import { type Editor } from '../main';
import { Event } from "./Event";

export class Rest extends Event {
    constructor(duration: number, app: Editor) {
        super(app);
        this.values["duration"] = duration;
    }

    _fallbackMethod = (): Event => {
        return this;
    }

    public static createRestProxy = (duration: number, app: Editor) => {
        const instance = new Rest(duration, app);
        return new Proxy(instance, {
            // @ts-ignore
            get(target, propKey, receiver) {
              // @ts-ignore
              if (typeof target[propKey] === 'undefined') {
                return target._fallbackMethod;
              }
              // @ts-ignore
              return target[propKey];
            },
            // @ts-ignore
            set(target, propKey, value, receiver) {
              return false;
            }
          });
    }

    out = (): void => {
        // TODO?
    }

}