export type Config = {
  tokens: TokensConfig;
};

type TokensConfig = {
  [Key: string | number]: string | number | TokensConfig;
};

export type RenderedTree = { [Key: string]: RenderedTree | string };

export type JettisonRc = {
  plugin: {
    configCollectors: Array<() => Promise<Config>>;
    tokenRenderers: Array<(config: Config) => Promise<RenderedTree>>;
  };
};

export async function collect(jettisonRc: JettisonRc): Promise<Config> {
  const all = await Promise.all(
    jettisonRc.plugin.configCollectors.map((p) => p())
  );
  return all.reduce((acc, x) => ({ ...acc, ...x }));
}
