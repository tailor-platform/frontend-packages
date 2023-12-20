# Contribution Guide 💪

## Setup

This repository uses [Turbo](https://turbo.build/) and [pnpm](https://pnpm.io/).

To ensure pnpm is used and install all the packages, run:

```sh
corepack enable
pnpm install
```

**Note**: if you run into issues, please make sure you're using the latest npm and corepack versions, as pnpm relies on those:

```sh
npm install -g npm
npm install -g corepack
```

## Commit Messages

This project uses commitizen to adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) standard.

1. Run `pnpm run prepare` to instantiate the husky hooks for preparing git commits.
1. Run `pnpm run commit`, and commitizen CLI will walk you through the commit process.

Although we recommend using the commit script for consistent commit messages, it's worth noting that you can still use the regular `git commit` command if preferred.

By using the correct conventional commit prefixes, the [labeler](./.github/workflows/labeler.yml) can apply relevant labels on the PRs. These are used at release time to auto-generate the release notes, see the section below.

### Types

| Type     | Description                                               |
| -------- | --------------------------------------------------------- |
| feat     | A new feature                                             |
| fix      | A bug fix                                                 |
| chore    | Changes to build process or auxiliary tools               |
| refactor | A code change that neither fixes a bug nor adds a feature |

### Scopes

| SCOPE         | Description                              |
| ------------- | ---------------------------------------- |
| (client)      | @tailor-platform/client                  |
| (datagrid)    | @tailor-platform/datagrid                |
| (ds)          | @tailor-platform/design-systems          |
| (dev-config)  | @tailor-platform/dev-config              |
| (monitoring)  | @tailor-platform/monitoring              |
| (oidc-client) | @tailor-platform/oidc-client             |
| (storybook)   | apps/storybook                           |
| (utils)       | @tailor-platform/utils                   |
|               | no scope (e.g., changes for root folder) |

### Examples

```
feat(ds): Add Pagination component for easier data browsing

fix(client): Fix bug causing errors in TailorProvider

chore(utils): Update comments for toTailorDate function
```

## Publish Workflow

### When a PR is opened

The labeler will run and add labels depending on the changed file paths ("Package: client", ...) and on the PR title prefix, following the Conventional Commit conventions ("Type: Feature", ...).

### When a PR is merged

1. The release workflows will be kicked off based on changes in the package.json files: the logic is if the package.json of the package(s) has not changed, then no version bump has been performed.

1. If there's a change in a package.json file, it will extract the version and check whether a tag already exists based on the package name: client -> client/x.x.x, utils -> utils/x.x.x, ...

1. If no tag for that version exists, it will use GitHub's release notes API to auto-generate the notes for the relevant package. Please note that the release notes are filtered to only include entries that pertain to the package being released.

1. After the release notes are generated, a new release is created on GitHub, and the package is published.

## Local Testing

To test a local change in any of the packages within the context of another project, you can use [yalc](https://github.com/wclr/yalc).

Below is an example of how to test a change in `@frontend-packages/[scope]` in `platform-frontend-services`:

At the frontend-packages folder's root:
Run `pnpm run publish:dev:[scope]` to locally publish the package or use `pnpm run publish:dev:watch:[scope]` for continuous local publishing while development.

In the application directory where the published package is used (e.g., platform-frontend-services > apps > dashboard), run:

```
pnpx yalc add @tailor-platform/[scope]
pnpm install
```

## Preview Release

### Use Case

When you're developing a feature in your application that integrates with frontend-packages, and you need to share or view your application's preview on Vercel/Cloudflare, use the preview release version.

### Practical Example

Here's a step-by-step guide on leveraging the preview release for efficient application development:

1. Start by releasing a preview version of the package: `@tailor-platform/design-systems@0.6.0-preview.1` (for directions in the next section).
1. Reference that preview package (`@tailor-platform/design-systems@0.6.0-preview.1`) in your application and deploy it.
1. As you iterate on your changes:
   - Adjust the package as necessary.
   - Release a subsequent preview by incrementing the number, for instance: `@tailor-platform/design-systems@0.6.0-preview.2`.
   - Deploy and check your application's preview with the newest preview version. Continue this iterative process until you're satisfied.
1. Once you're satisfied with the preview:
   - Update the package version to remove the preview moniker (e.g., `-preview.2`).
   - Ensure the corresponding PR is reviewed and merged to officially release: `@tailor-platform/design-systems@0.6.0`.
1. Lastly, update your application to employ the newly official release: `@tailor-platform/design-systems@0.6.0`.

This process allows you to iteratively refine your package and ensure its compatibility with your application through preview versions.

### Publishing a Preview Release

To publish a new preview version of your package to the GitHub Package Registry, follow these steps:

1. Configure your GitHub token with `write:packages` permission; see our [readme](./README.md) for details.
1. Ensure all your changes are committed and your working directory is clean.
1. Navigate to the root of the working package directory.
1. Run the following command to build and publish your package:
   ```bash
   pnpm run build && pnpm publish --tag preview
   ```
1. This command will first build your package and then publish it to the specified registry.
1. Once published, the new version will be available for use.

> **Note**: Ensure you've set up the necessary authentication and configuration to publish to the GitHub Package Registry. Refer to [GitHub's documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) for more details.
