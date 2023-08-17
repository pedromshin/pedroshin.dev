import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);

export const theme = fullConfig.theme;
