# storybook

This application provides a Storybook for frontend-packages.

## Scripts

- **`dev`**: Starts the development server for Storybook on port 6006.
- **`build-storybook`**: Builds the Storybook for production deployment.
- **`lint`**: Runs ESLint on the codebase.
- **`panda`**: [Generate new CSS utilities](https://panda-css.com/docs/references/cli#panda-codegen) based on the panda.config.ts file.
- **`chromatic`**: This command is used in CI – publish build to [Chromatic](https://www.chromatic.com/).
- **`ark:types`**: Executes a script to generate type definition files for UI components from the [ark package](https://github.com/chakra-ui/ark).
- **`storybook:types`**: Executes a script to generate type definition files for [Storybook ArgTypes](https://storybook.js.org/docs/react/api/arg-types).
- **`ark:storybook:types`**: Runs both the `ark:types` and `storybook:types` commands to generate type definitions for both Ark and Storybook. Recommended to use this command when updating the @ark-ui/react version in [@tailor-platform/design-systems](../../packages/design-systems).
