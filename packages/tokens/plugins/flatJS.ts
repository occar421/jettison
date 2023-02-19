import { Config, JettisonRc } from "@jettison-system/config";

export const render: JettisonRc["plugin"]["tokenRenderers"][number] = async (
  config
) => {
  if (Object.keys(config.tokens).length === 0) {
    return {};
  }

  const constants = process(config.tokens).map(
    ([k, v]) => `export const ${k}=${v};`
  );

  return {
    "index.js": constants.join(""),
  };
};

function process(config: Config["tokens"]): [key: string, value: string][] {
  return Object.entries(config).flatMap(([k, v]) => {
    if (typeof v === "string") {
      return [[k, `"${v}"`]];
    }

    if (typeof v === "number") {
      return [[k, v.toString()]];
    }

    return process(v).map(
      ([subK, subV]) =>
        [
          `${k}${subK.charAt(0).toUpperCase() + subK.slice(1)}`,
          subV,
        ] satisfies [string, string]
    );
  });
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("empty object when empty config", async () => {
    const result = await render({ tokens: {} });

    expect(result).toStrictEqual({});
  });

  it("one CSS variable when 1 config", async () => {
    const result = await render({ tokens: { main: "#000000" } });

    expect(result).toStrictEqual({
      "index.js": `export const main="#000000";`,
    });
  });

  it("two CSS variable when 2 config", async () => {
    const result = await render({
      tokens: { main: "#000000", opacity: 0.8 },
    });

    expect(result).toStrictEqual({
      "index.js": `export const main="#000000";export const opacity=0.8;`,
    });
  });

  it("kebab-case named CSS variable when nested config", async () => {
    const result = await render({
      tokens: { main: { lightest: "#000000" } },
    });

    expect(result).toStrictEqual({
      "index.js": `export const mainLightest="#000000";`,
    });
  });
}
