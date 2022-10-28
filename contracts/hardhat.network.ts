import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig } from "hardhat/config";

// Ensure that we have all the environment variables we need.
let mnemonic: string;
if (!process.env.MNEMONIC) {
  throw new Error("Please set your MNEMONIC in a .env file");
} else {
  mnemonic = process.env.MNEMONIC;
}

let infuraApiKey: string;
if (!process.env.INFURA_API_KEY) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
} else {
  infuraApiKey = process.env.INFURA_API_KEY;
}

let alchemyUrl: string;
if (!process.env.ALCHEMY_URL) {
  throw new Error("Please set your ALCHEMY_URL in a .env file");
} else {
  alchemyUrl = process.env.ALCHEMY_URL;
}

const networks: HardhatUserConfig["networks"] = {
  coverage: {
    url: "http://127.0.0.1:8555",
    blockGasLimit: 200000000,
    allowUnlimitedContractSize: true,
  },
  localhost: {
    chainId: 1337,
    url: "http://127.0.0.1:8545",
    allowUnlimitedContractSize: true,
  },
};

if (alchemyUrl && process.env.FORK_ENABLED && mnemonic) {
  networks.hardhat = {
    chainId: 1,
    forking: {
      url: alchemyUrl,
    },
    accounts: {
      mnemonic,
    },
  };
} else {
  networks.hardhat = {
    allowUnlimitedContractSize: true,
    mining: {
      auto: true,
      interval: 30000, // 30 sec per block
    },
  };
}

if (mnemonic) {
  networks.gnosis = {
    chainId: 100,
    url: "https://rpc.xdaichain.com/",
    accounts: {
      mnemonic,
    },
  };
  networks.cronos = {
    chainId: 77,
    url: "https://sokol.poa.network",
    accounts: {
      mnemonic,
    },
  };
  networks.polygon = {
    chainId: 137,
    url: "https://rpc-mainnet.maticvigil.com",
    accounts: {
      mnemonic,
    },
  };
}

if (infuraApiKey && mnemonic) {
  networks.goerli = {
    url: `https://goerli.infura.io/v3/${infuraApiKey}`,
    accounts: {
      mnemonic,
    },
  };

  networks.mainnet = {
    url: `https://mainnet.infura.io/v3/${infuraApiKey}`,
    accounts: {
      mnemonic,
    },
  };
} else {
  console.warn("No infura or hdwallet available for testnets");
}

export default networks;
