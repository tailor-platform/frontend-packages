# frontend-packages

This is the monorepo for Tailor npm packages.

### @tailor-platform/client

A React Context provider that handles user authentication.

### @tailor-platform/datagrid

A Datagrid component and hooks tailored for managing complex data tables.

### @tailor-platform/utils

Utility functions to work with Tailor data types, conversions, etc.

### @tailor-platform/design-systems

Design Systems that handles shared UIs.

### @tailor-platform/dev-config

Tailor's base configuration for ESLint, Prettier and Typescript.

### @tailor-platform/monitoring

Tools and utilities for integrating monitoring solutions.

### @tailor-platform/auth

A React Context provider and utilities for handling Tailor OIDC authentication

## Other Packages

Those packages are used within this repository and aren't published (yet?).

## Apps

### storybook

Storybook for the packages, visible at https://storybook.tailor.tech.

## Dependency Versioning Information

Our project is aligned with [Vercel's recommendation to use Node.js 18](https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/node-js). As a result, we are using the corresponding type definitions for Node.js 18 (@types/node) within our monorepo.

## How to Contribute

For guidelines on how to contribute, please refer to the [CONTRIBUTING](./CONTRIBUTING.md) document where you'll find all the necessary details.
