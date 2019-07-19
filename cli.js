#!/usr/bin/env node
'use strict'

const mri = require('mri')
const {isatty} = require('tty')

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'length-prefixed', 'l',
		'json', 'j'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    cat gtfs-rt-feed.pbf | print-gtfs-rt
Options:
	--length-prefixed  -l  Read input as length-prefixed.
	                       See https://www.npmjs.com/package/length-prefixed-stream
	--json  -j             Output JSON instead of a pretty represenation.
Examples:
    curl 'https://example.org/gtfs-rt.pbf' | print-gtfs-rt
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`print-gtfs-rt v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err.message || (err + ''))
	process.exit(1)
}

if (isatty(process.stdin.fd)) showError('You must pipe into print-gtfs-rt.')

const {decode: decodeLengthPrefixed} = require('length-prefixed-stream')
const {FeedMessage} = require('gtfs-rt-bindings')
const {inspect} = require('util')

const read = (readable) => {
	return new Promise((resolve, reject) => {
		const chunks = []
		readable
		.once('error', reject)
		.on('data', chunk => chunks.push(chunk))
		.once('end', () => resolve(chunks))
	})
}

const isLengthPrefixed = argv['length-prefixed'] || argv.l
const printAsJSON = argv.json || argv.j
const printWithColors = isatty(process.stdout.fd)

const onFeedMessage = (buf) => {
	const data = FeedMessage.decode(buf)
	if (!data || !data.header || !Array.isArray(data.entity)) {
		throw new Error('invalid feed')
	}

	for (const entity of data.entity) {
		const msg = printAsJSON
			? JSON.stringify(entity)
			: inspect(entity, {depth: null, colors: printWithColors})
		process.stdout.write(msg + '\n')
	}
}

if (isLengthPrefixed) {
	process.stdin
	.once('error', showError)
	.pipe(decodeLengthPrefixed())
	.once('error', showError)
	.on('data', onFeedMessage)
} else {
	read(process.stdin)
	.then(chunks => onFeedMessage(Buffer.concat(chunks)))
	.catch(showError)
}
