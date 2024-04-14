import { type UserAPI } from "./API";
import { type Editor } from "../main";

export const once = (api: UserAPI) => (): boolean => {
  const firstTime = api.onceEvaluator;
  api.onceEvaluator = false;
  return firstTime;
};

export const counter = (api: UserAPI) => (name: string | number, limit?: number, step?: number): number => {
  if (!(name in api.counters)) {
    api.counters[name] = {
      value: 0,
      step: step ?? 1,
      limit,
    };
  } else {
    if (api.counters[name].limit !== limit) {
      api.counters[name].value = 0;
      api.counters[name].limit = limit;
    }

    if (api.counters[name].step !== step) {
      api.counters[name].step = step ?? api.counters[name].step;
    }

    api.counters[name].value += api.counters[name].step;

    if (api.counters[name].limit !== undefined && api.counters[name].value > api.counters[name].limit) {
      api.counters[name].value = 0;
    }
  }

  return api.counters[name].value;
};

export const i = (app: Editor) => (n?: number) => {
  if (n !== undefined) {
    app.universes[app.selected_universe].global.evaluations = n;
    return app.universes[app.selected_universe];
  }
  return app.universes[app.selected_universe].global.evaluations as number;
};
