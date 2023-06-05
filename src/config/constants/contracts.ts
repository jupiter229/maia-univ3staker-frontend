import { ChainID } from "@/types";
import { AddressZero } from "@ethersproject/constants";

// TODO: Update Mainnet to the correct addresses
export const Contracts: { [k: string]: { [k in ChainID]: string } } = {
  staker: {
    [ChainID.METIS]: "0x8D80D8de2685583BFd60B5fF201917D28661a087",
    [ChainID.GOERLI]: "0xf5fd18Cd5325904cC7141cB9Daca1F2F964B9927",
  },
  positionManager: {
    [ChainID.METIS]: "0x1fc37a909cB3997f96cE395B3Ee9ac268C9bCcdb ",
    [ChainID.GOERLI]: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
};

export default Contracts;
