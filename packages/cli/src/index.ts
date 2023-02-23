import { collect, JettisonRc } from "@jettison-system/config";
import { render as renderToken } from "@jettison-system/tokens";

// should be from user's file
const rc = {
  plugin: {
    configCollectors: [() => Promise.resolve({ tokens: {} })],
    tokenRenderers: [() => Promise.resolve({})],
  },
} satisfies JettisonRc;

// should be command line script

const config = await collect(rc);

const tokensList = await renderToken(config, rc);

console.log(tokensList);
