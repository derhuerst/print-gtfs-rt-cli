# print-gtfs-rt-cli

**Read a [GTFS Realtime (GTFS-RT)](https://developers.google.com/transit/gtfs-realtime/) feed from stdin, print human-readable or as JSON.**

[![npm version](https://img.shields.io/npm/v/print-gtfs-rt-cli.svg)](https://www.npmjs.com/package/print-gtfs-rt-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/print-gtfs-rt-cli.svg)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)
[![chat with me on Twitter](https://img.shields.io/badge/chat%20with%20me-on%20Twitter-1da1f2.svg)](https://twitter.com/derhuerst)


## Installing

```shell
npm install -g print-gtfs-rt-cli
```

Or use [`npx`](https://npmjs.com/package/npx). ✨


## Usage

```
Usage:
    cat gtfs-rt-feed.pbf | print-gtfs-rt
Options:
    --length-prefixed  -l  Read input as length-prefixed.
                           See https://www.npmjs.com/package/length-prefixed-stream
    --json             -j  Output newline-delimeted JSON (http://ndjson.org).
    --single-json -s       Output a single JSON array.
    --depth            -d  Number of nested levels to print. Default: infinite
    --include-all      -a  Print the entire FeedMessage, including its header.
    --gtfs-rt-bindings     Path to GTFS-RT bindings. Must be compatible with
                           those generated by protobufjs.
Examples:
    curl 'https://example.org/gtfs-rt.pbf' | print-gtfs-rt
```


## Contributing

If you have a question or have difficulties using `print-gtfs-rt-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/print-gtfs-rt-cli/issues).


## Example feed

The example feed is taken from [the Swiss open GTFS-RT feed](https://opentransportdata.swiss/en/dataset/gtfsrt), licensed under [their open data license](https://opentransportdata.swiss/en/terms-of-use/).
