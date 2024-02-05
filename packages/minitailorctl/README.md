# minitailorctl

minitailorctl (mtctl) is a CLI tool that wraps [tailorctl](https://github.com/tailor-platform/tailorctl) to streamline the development of Tailor Platform applications.

## Install

```bash
npm install -g @tailor-platform/minitailorctl
```

As a result, the `minitailorctl` command (and its `mtctl` alias) will be available in your terminal.

## Features

### Tailorctl proxy

minitailorctl can run any command from [tailorctl](https://github.com/tailor-platform/tailorctl) and is pre-configured to communicate with a locally running minitailor instance. 

```bash
# The below is the same as "tailorctl alpha workspace create --name test-workspace",
# but always runs with environment variables to connect to minitailor internally.

$ minitailorctl -- alpha workspace create --name test-workspace
Workspace test-workspace created
```
