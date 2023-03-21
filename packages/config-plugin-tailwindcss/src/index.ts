import { JettisonRc } from "@jettison-system/config";

import Processor from "windicss";

// should be new module due to dependency on TailwindCSS
export const collector: (pluginConfig: {
  tailwindConfig: any;
}) => JettisonRc["plugin"]["configCollectors"][number] =
  (pluginConfig) => async () => {
    const p = new Processor();
    const { theme: tokens } = p.loadConfig(pluginConfig.tailwindConfig);
    return { tokens };
  };

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("one token when 1 tailwind theme config", async () => {
    const result = await collector({
      tailwindConfig: { theme: { colors: { blue: "#1fb6ff" } } },
    })();

    expect(result).toHaveProperty("tokens.colors.blue", "#1fb6ff");
  });
}
