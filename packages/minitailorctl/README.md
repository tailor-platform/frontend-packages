# minitailorctl

minitailorctl (mtctl) is a CLI tool that operates minitailor and contains some useful features that help development of Tailor Platform application.

## Install

```bash
npm install -g @tailor-platform/minitailorctl
```

## Features

### Tailorctl proxy

minitailorctl can run any commands on [tailorctl](https://github.com/tailor-platform/tailorctl) without explictly configured your envivonment to connect it to minitailor.

```bash
# The below is the same as "tailorctl alpha workspace create --name test-workspace",
# but always runs with environment variables to connect to minitailor internally.

$ minitailorctl -- alpha workspace create --name test-workspace
Workspace test-workspace created
```
