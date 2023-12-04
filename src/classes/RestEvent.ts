import { type Editor } from "../main";
import { AbstractEvent } from "./AbstractEvents";

export class RestEvent extends AbstractEvent {
  constructor(length: number, app: Editor) {
    super(app);
    this.values["noteLength"] = length;
  }

  _fallbackMethod = (): AbstractEvent => {
    return RestEvent.createRestProxy(this.values["noteLength"], this.app);
  };

  public static createRestProxy = (length: number, app: Editor): RestEvent => {
    const instance = new RestEvent(length, app);
    return new Proxy(instance, {
      // @ts-ignore
      get(target, propKey, receiver) {
        // @ts-ignore
        if (typeof target[propKey] === "undefined") {
          return target._fallbackMethod;
        }
        // @ts-ignore
        return target[propKey];
      },
      // @ts-ignore
      set(target, propKey, value, receiver) {
        return false;
      },
    });
  };

  out = (): void => {
    // TODO?
  };
}
