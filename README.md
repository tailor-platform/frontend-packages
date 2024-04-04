![cover](https://raw.githubusercontent.com/tailor-platform/frontend-packages/main/assets/cover.png)

This is the monorepo for Tailor npm packages.

| package                                                                                          | status                                                                                                                                                                                                                                      | description                                                                               | links                                                                                                    |
| :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| [@tailor-platform/auth](https://www.npmjs.com/package/@tailor-platform/auth)                     | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/auth) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_auth.yml?branch=main)             | An utilities for handling Tailor Platform authentication with Next.js and Apollo support. | [Docs](https://tailor-platform.github.io/frontend-packages/modules/_tailor_platform_auth.html)           |
| [@tailor-platform/design-systems](https://www.npmjs.com/package/@tailor-platform/design-systems) | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/design-systems) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_ds.yml?branch=main)     | Design Systems that handles shared UIs.                                                   | [Docs](https://tailor-platform.github.io/frontend-packages/modules/_tailor_platform_design_systems.html) |
| [@tailor-platform/utils](https://www.npmjs.com/package/@tailor-platform/utils)                   | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/utils) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_utils.yml?branch=main)           | Utility functions to work with Tailor data types, conversions, etc.                       | [Docs](https://tailor-platform.github.io/frontend-packages/modules/_tailor_platform_utils.html)          |
| [@tailor-platform/monitoring](https://www.npmjs.com/package/@tailor-platform/monitoring)         | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/monitoring) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_monitoring.yml?branch=main) | Tools and utilities for integrating monitoring solutions.                                 | [Docs](https://tailor-platform.github.io/frontend-packages/modules/_tailor_platform_monitoring.html)     |
| [@tailor-platform/dev-config](https://www.npmjs.com/package/@tailor-platform/dev-config)         | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/dev-config)                                                                                                                                                                    | Tailor's base configuration for ESLint, Prettier and Typescript.                          | [Docs](https://tailor-platform.github.io/frontend-packages/modules/_tailor_platform_dev_config.html)     |

## Apps

### storybook

Storybook for the packages, visible at https://storybook.tailor.tech.

## Dependency Versioning Information

Our project is aligned with [Vercel's recommendation to use Node.js 18](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js). As a result, we are using the corresponding type definitions for Node.js 18 (@types/node) within our monorepo.

## How to Contribute

For guidelines on how to contribute, please refer to the [CONTRIBUTING](./CONTRIBUTING.md) document where you'll find all the necessary details.
