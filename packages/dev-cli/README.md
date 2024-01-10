# @tailor-platform/dev-cli

With Tailor Platform dev CLI, you can:

* install required dependencies for building your own Tailor Platform apps
* start local devlopment stack, apply your manifest on it

## Installation
```
npm install -D @tailor-platform/dev-cli
```

Once after your installation, `tailordev` command will be available.

```
$ npx tailordev --help
Usage: tailordev [options] [command]

CLI for Tailor Platform application devs

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  reset [options]              reset local environment
  start [options]              start local development environment
  apply [options]              apply manifest onto local environment
  import [options] <paths...>  import seed manifest (this needs minitailor running by `start` command)
  install:deps [options]       install required dependencies (tailorctl, cuelang)
  uninstall:deps               uninstall dependencies
  help [command]               display help for command
```

## Commands

WIP
