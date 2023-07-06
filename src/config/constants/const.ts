import JSBI from "jsbi";

export const TICK_WIDTH = 0.01;
export const TICK_INCREMENT = 0.0001;
export const TICK_BASE = 1.0001;
export const MIN_TICK = -887272;
export const MAX_TICK = 887272;
export const MAX_RANGE = 2 ** 256;

export const YEAR = 31536000;

// constants used internally but not expected to be used externally
export const NEGATIVE_ONE = JSBI.BigInt(-1);
export const ZERO = JSBI.BigInt(0);
export const ONE = JSBI.BigInt(1);

// used in liquidity amount math
export const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96));
export const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2));

export const MaxUint256 = JSBI.BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 3000,
  HIGH = 10000,
}

export const WHITELISTED_REWARDS = [
  "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
];
