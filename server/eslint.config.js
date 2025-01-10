import prettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist"]
  },
  {
    extends: [...tseslint.configs.recommended],
    files: ["**/*.ts"],
    plugins: { prettier }
  }
);
