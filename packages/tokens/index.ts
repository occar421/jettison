import { Config, JettisonRc, RenderedTree } from "@jettison-system/config";

export async function render(
  config: Config,
  jettisonRc: JettisonRc
): Promise<RenderedTree[]> {
  return await Promise.all(
    jettisonRc.plugin.tokenRenderers.map((p) => p(config))
  );
}
