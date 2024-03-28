# frontend-packages

![cover](https://raw.githubusercontent.com/tailor-platform/frontend-packages/main/assets/cover.png)

This is the monorepo for Tailor npm packages.

| package                                                    | status                                                                                                                                                                                                                                      | description                                                                               |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------- |
| [@tailor-platform/auth](packages/auth)                     | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/auth) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_auth.yml?branch=main)             | An utilities for handling Tailor Platform authentication with Next.js and Apollo support. |
| [@tailor-platform/design-systems](packages/design-systems) | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/design-systems) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_ds.yml?branch=main)     | Design Systems that handles shared UIs.                                                   |
| [@tailor-platform/utils](packages/utils)                   | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/utils) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_utils.yml?branch=main)           | Utility functions to work with Tailor data types, conversions, etc.                       |
| [@tailor-platform/monitoring](packages/monitoring)         | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/monitoring) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tailor-platform/frontend-packages/test_package_monitoring.yml?branch=main) | Tools and utilities for integrating monitoring solutions.                                 |
| [@tailor-platform/dev-config](packages/dev-config)         | ![NPM Version](https://img.shields.io/npm/v/@tailor-platform/dev-config)                                                                                                                                                                    | Tailor's base configuration for ESLint, Prettier and Typescript.                          |

## Apps

### storybook

Storybook for the packages, visible at https://storybook.tailor.tech.

## Dependency Versioning Information

Our project is aligned with [Vercel's recommendation to use Node.js 18](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js). As a result, we are using the corresponding type definitions for Node.js 18 (@types/node) within our monorepo.

## How to Contribute

For guidelines on how to contribute, please refer to the [CONTRIBUTING](./CONTRIBUTING.md) document where you'll find all the necessary details.
