Tailor's base configurations for ESLint, Prettier and Typescript.

## Installation

```bash
npm install -D @tailor-platform/dev-config
```

If you are using pnpm:

```bash
pnpm install -D @tailor-platform/dev-config@latest
```

## Usage

### Prettier

Add the following in your `package.json`:

```jsonc
{
  // ...
  "prettier": "@tailor-platform/dev-config/prettier",
}
```

See [sharing configuration](https://prettier.io/docs/en/configuration#sharing-configurations) for more details.

### ESLint

Add the following line in your `.eslintrc.js` file to extend the rules from `@tailor-platform/dev-config/eslint`:

```js
module.exports = {
  ...require("@tailor-platform/dev-config/eslint"),
};
```

### Typescript

Add the following in your `tsconfig.json`:

```jsonc
{
  "extends": "@tailor-platform/dev-config/typescript/nextjs",
}
```

### Overriding configuration

```js
module.exports = {
  ...require("@tailor-platform/dev-config/prettier"),
  // your overrides here
};
```
