import lo from "lodash";

import { config } from "config";

import debug, { DevTools } from "./debug";

// NOTE: debug helpers ----------------------------------------------------------------------------]

const dev: DevTools = debug;
// copy of `DevTools` with `silent` loggers
const devNone: DevTools = lo.transform(
    dev,
    (acc, _, key) => {
        // @ts-expect-error string can be used to  index`acc`
        // eslint-disable-next-line @typescript-eslint/unbound-method
        acc[key] = lo.noop;
    },
    {} as DevTools,
);

// make `DevTools` available from global scope
if (typeof window !== "undefined") {
    window.dev = config.isDev ? dev : devNone;
    if (config.isDev) {
        // for quick tests with `lodash`
        window._ = lo;
    }
}
