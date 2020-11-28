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
		'json', 'j',
		'single-json', 's',
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    cat gtfs-rt-feed.pbf | print-gtfs-rt
Options:
	--length-prefixed  -l  Read input as length-prefixed.
	                       See https://www.npmjs.com/package/length-prefixed-stream
	--json  -j             Output newline-delimeted JSON (http://ndjson.org).
	--single-json -s       Output a single JSON array.
	--depth            -d  Number of nested levels to print. Default: infinite
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
	if (err && err.code === 'EPIPE') return; // todo: refine this
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err.message || (err + ''))
	process.exit(1)
}

if (isatty(process.stdin.fd)) showError('You must pipe into print-gtfs-rt.')

const {decode: decodeLengthPrefixed} = require('length-prefixed-stream')
const {pipeline} = require('stream')
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
const printAsNDJSON = argv.json || argv.j
const printAsJSON = argv['single-json'] || argv.s
const printWithColors = isatty(process.stdout.fd)
const depth = argv.depth || argv.d ? parseInt(argv.depth || argv.d) : null

const onFeedMessage = (buf) => {
	const data = FeedMessage.decode(buf)
	if (!data || !data.header || !Array.isArray(data.entity)) {
		throw new Error('invalid feed')
	}

	if (printAsJSON) {
		process.stdout.write('[\n')
	}
	for (var i = 0; i < data.entity.length; ++i) {
		const entity = data.entity[i];
		const msg = printAsNDJSON || printAsJSON
			? JSON.stringify(entity)
			: inspect(entity, {depth, colors: printWithColors})
		const isLastEntity = i == data.entity.length - 1;
		const delimeter = (printAsJSON && !isLastEntity) ? ',\n' : '\n'
		process.stdout.write(msg + delimeter)
	}
	if (printAsJSON) {
		process.stdout.write(']\n')
	}
}

if (isLengthPrefixed) {
	const decoder = decodeLengthPrefixed()
	pipeline(
		process.stdin,
		decoder,
		showError,
	)
	decoder.on('data', onFeedMessage)
} else {
	read(process.stdin)
	.then(chunks => onFeedMessage(Buffer.concat(chunks)))
	.catch(showError)
}
process.stdout.on('error', showError)
