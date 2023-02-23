import { Config, JettisonRc } from "../index.js";

// should be new module due to dependency on TailwindCSS
export const collector: (pluginConfig: {
  tailwindConfig: any;
}) => JettisonRc["plugin"]["configCollectors"][number] =
  (pluginConfig) => async () => {
    return { tokens: pluginConfig["tailwindConfig"]["theme"] ?? {} };
  };

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("empty config when empty tailwind config", async () => {
    const result = await collector({
      tailwindConfig: { theme: {} },
    })();

    expect(result).toStrictEqual({ tokens: {} } satisfies Config);
  });

  it("one token when 1 tailwind theme config", async () => {
    const result = await collector({
      tailwindConfig: { theme: { colors: { blue: "#1fb6ff" } } },
    })();

    expect(result).toStrictEqual({
      tokens: { colors: { blue: "#1fb6ff" } },
    } satisfies Config);
  });
}
