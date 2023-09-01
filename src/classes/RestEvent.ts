import { type Editor } from "../main";
import { Event } from "./AbstractEvents";

export class RestEvent extends Event {
  constructor(length: number, app: Editor) {
    super(app);
    this.values["length"] = length;
  }

  _fallbackMethod = (): Event => {
    return RestEvent.createRestProxy(this.values["length"], this.app);
  };

  public static createRestProxy = (
    length: number,
    app: Editor
  ): RestEvent => {
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
