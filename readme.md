# print-gtfs-rt-cli

**Read a [GTFS Realtime](https://developers.google.com/transit/gtfs-realtime/) feed from stdin, print human-readable or as JSON.**

[![npm version](https://img.shields.io/npm/v/print-gtfs-rt-cli.svg)](https://www.npmjs.com/package/print-gtfs-rt-cli)
[![build status](https://api.travis-ci.org/derhuerst/print-gtfs-rt-cli.svg?branch=master)](https://travis-ci.org/derhuerst/print-gtfs-rt-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/print-gtfs-rt-cli.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst) [![Greenkeeper badge](https://badges.greenkeeper.io/derhuerst/print-gtfs-rt-cli.svg)](https://greenkeeper.io/)


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
	--json  -j  Output JSON instead of a pretty represenation.
Examples:
    curl 'https://example.org/gtfs-rt.pbf' | print-gtfs-rt
```


## Contributing

If you have a question or have difficulties using `print-gtfs-rt-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/print-gtfs-rt-cli/issues).


## Example feed

The example feed is taken from [the Swiss open GTFS-RT feed](https://opentransportdata.swiss/en/dataset/gtfsrt), licensed under [their open data license](https://opentransportdata.swiss/en/terms-of-use/).
