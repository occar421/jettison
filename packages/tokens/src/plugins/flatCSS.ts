import { Config, JettisonRc } from "@jettison-system/config";

export const render: (pluginConfig: {
  filePath: string;
}) => JettisonRc["plugin"]["tokenRenderers"][number] =
  (pluginConfig) => async (config) => {
    if (Object.keys(config.tokens).length === 0) {
      return {};
    }

    const variables = process(config.tokens).map(([k, v]) => `--${k}:${v};`);

    return {
      [pluginConfig.filePath]: `:root{${variables.join("")}}`,
    };
  };

function process(config: Config["tokens"]): [key: string, value: string][] {
  return Object.entries(config).flatMap(([k, v]) => {
    if (typeof v === "string" || typeof v === "number") {
      return [[k, v.toString()]];
    }

    return process(v).map(
      ([subK, subV]) => [`${k}-${subK}`, subV] satisfies [string, string]
    );
  });
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  const defaultRender = render({ filePath: "index.css" });

  it("empty object when empty config", async () => {
    const result = await defaultRender({ tokens: {} });

    expect(result).toStrictEqual({});
  });

  it("one CSS variable when 1 config", async () => {
    const result = await defaultRender({ tokens: { main: "#000000" } });

    expect(result).toStrictEqual({ "index.css": `:root{--main:#000000;}` });
  });

  it("two CSS variable when 2 config", async () => {
    const result = await defaultRender({
      tokens: { main: "#000000", sub: "#FFFFFF" },
    });

    expect(result).toStrictEqual({
      "index.css": `:root{--main:#000000;--sub:#FFFFFF;}`,
    });
  });

  it("kebab-case named CSS variable when nested config", async () => {
    const result = await defaultRender({
      tokens: { main: { 0: "#000000" } },
    });

    expect(result).toStrictEqual({
      "index.css": `:root{--main-0:#000000;}`,
    });
  });
}
