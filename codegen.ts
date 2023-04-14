import type { CodegenConfig } from "@graphql-codegen/cli";
import {
  MAINNET_SUBGRAPH_URL,
  UNISWAP_MAINNET_SUBGRAPH_URL,
} from "./src/config/constants/env";

const config: CodegenConfig = {
  overwrite: true,
  schema: [MAINNET_SUBGRAPH_URL, UNISWAP_MAINNET_SUBGRAPH_URL],
  documents: "src/**/*.graphql",
  generates: {
    "src/types/graphql/": {
      preset: "client",
      plugins: [
        {
          "typescript-react-apollo": {
            documentVariablePrefix: "GQL",
            documentVariableSuffix: "",
            fragmentVariablePrefix: "GQL",
            fragmentVariableSuffix: "",
          },
        },
      ],
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
