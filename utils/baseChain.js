import config from "./config";

const baseChain = config.find((chain) => chain.isBase);

export default baseChain;
