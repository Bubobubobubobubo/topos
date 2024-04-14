export const once = (app: any) => (): boolean => {
    const firstTime = app.api.onceEvaluator;
    app.api.onceEvaluator = false;
    return firstTime;
};

export const counter = (app: any) => (name: string | number, limit?: number, step?: number): number => {
    if (!(name in app.counters)) {
        app.counters[name] = {
            value: 0,
            step: step ?? 1,
            limit,
        };
    } else {
        if (app.counters[name].limit !== limit) {
            app.counters[name].value = 0;
            app.counters[name].limit = limit;
        }

        if (app.counters[name].step !== step) {
            app.counters[name].step = step ?? app.counters[name].step;
        }

        app.counters[name].value += app.counters[name].step;

        if (app.counters[name].limit !== undefined && app.counters[name].value > app.counters[name].limit) {
            app.counters[name].value = 0;
        }
    }

    return app.counters[name].value;
};

export const i = (app: any) => (n?: number) => {
    if (n !== undefined) {
        app.universes[app.selected_universe].global.evaluations = n;
        return app.universes[app.selected_universe];
    }
    return app.universes[app.selected_universe].global.evaluations as number;
};