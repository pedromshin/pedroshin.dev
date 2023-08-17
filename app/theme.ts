import resolveConfig from "tailwindcss/resolveConfig";
import { Config } from "tailwindcss/types/config.js";

import { DefaultTheme } from "../node_modules/tailwindcss/types/generated/default-theme";
import tailwindConfig from "../tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig) as {
  theme: Config["theme"] &
    DefaultTheme & {
      screens: {
        xs: string;
      };
    };
};

export const theme = fullConfig.theme;
