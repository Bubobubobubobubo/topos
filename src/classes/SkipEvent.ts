export class SkipEvent {

    _fallbackMethod = (): SkipEvent => {
        return this;
    }
  
    public static createSkipProxy = () => {
        const instance = new SkipEvent();
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

    out = (): void => {}

  }