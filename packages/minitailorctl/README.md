# minitailorctl

minitailorctl (mtctl) is a CLI tool that operates minitailor and contains some useful features that help development of Tailor Platform application.

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
