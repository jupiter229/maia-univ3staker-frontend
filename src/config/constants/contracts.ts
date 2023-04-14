import { ChainID } from "@/types";
import { AddressZero } from "@ethersproject/constants";

// TODO: Update Mainnet to the correct addresses
export const Contracts: { [k: string]: { [k in ChainID]: string } } = {
  staker: {
    [ChainID.MAINNET]: AddressZero,
    [ChainID.GOERLI]: "0xf5fd18Cd5325904cC7141cB9Daca1F2F964B9927",
  },
  positionManager: {
    [ChainID.MAINNET]: AddressZero,
    [ChainID.GOERLI]: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
  },
};

export default Contracts;
