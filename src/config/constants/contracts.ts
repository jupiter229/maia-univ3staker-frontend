import { ChainID } from "@/types";

export const Contracts: { [k: string]: { [k in ChainID]: string } } = {
  staker: {
    [ChainID.MAINNET]: "0xf5fd18Cd5325904cC7141cB9Daca1F2F964B9927",
    [ChainID.GOERLI]: "0xf5fd18Cd5325904cC7141cB9Daca1F2F964B9927",
  },
};

export default Contracts;
