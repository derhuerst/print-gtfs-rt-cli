#!/bin/bash

set -e
set -o pipefail

cd "$(dirname $0)"

set -x

cat example-feed.pbf | ./cli.js --json | wc -l
cat example-feed.pbf | ./cli.js --json --include-all | wc -l

# FeedMessage with valid FeedHeader but 0 FeedEntitys
empty="$(echo '0a 0d 0a 03 32 2e 30 10 00 18 9d ce c4 91 06' | xxd -r -p | ./cli.js)"
if [ "$empty" != '' ]; then
	1>&2 echo "FeedMessage with valid FeedHeader but 0 FeedEntitys: unexpected output \`$health_status\`"
	exit 1
fi
