import { JettisonRc } from "@jettison-system/config";

export const render: JettisonRc["plugin"]["tokenRenderers"][number] = async (
  config
) => {
  // @TODO
  return "";
};

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("empty string when empty config", async () => {
    const result = await render({ tokens: {} });

    expect(result).toBe("");
  });
}
