#!/usr/bin/env node
'use strict'

const mri = require('mri')
const {isatty} = require('tty')

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
		'json', 'j'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    cat gtfs-rt-feed.pbf | print-gtfs-rt
Options:
	--json  -j  Output JSON instead of a pretty represenation.
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

const Pbf = require('pbf')
const {FeedMessage} = require('gtfs-rt-bindings')
const {inspect} = require('util')

const read = (readable) => {
	return new Promise((resolve, reject) => {
		const chunks = []
		readable
		.once('error', reject)
		.on('data', chunk => chunks.push(chunk))
		.once('end', () => resolve(Buffer.concat(chunks)))
	})
}

const printAsJSON = argv.json || argv.j
const printWithColors = isatty(process.stdout.fd)

// todo: convert PBF in a streaming way
read(process.stdin)
.then((buf) => {
	const data = FeedMessage.read(new Pbf(buf))
	if (!data || !data.header || !Array.isArray(data.entity)) {
		throw new Error('invalid feed')
	}

	for (const entity of data.entity) {
		const msg = printAsJSON
			? JSON.stringify(entity)
			: inspect(entity, {depth: null, colors: printWithColors})
		process.stdout.write(msg + '\n')
	}
})
.catch(showError)
