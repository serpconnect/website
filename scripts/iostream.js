const stream = require('stream')
const path = require('path')
const fs = require('fs')
const util = require('util')

function PathWriter(root) {
	if (!(this instanceof PathWriter))
		return new PathWriter(root)

	stream.Writable.call(this)

	this.on('resolve', () => {
		this._sink = fs.createWriteStream(root)
		this.emit('start')
	})

	this._walk(root, root)
}
PathWriter.prototype._walk = function(root, segment) {
	var dir = path.dirname(segment)
	fs.mkdir(dir, (err) => {
		if (err && err.code !== 'EEXIST')
			this._walk(root, dir)
		else if (segment === root)
			this.emit('resolve')
		else
			this._walk(root, root)
	})
}
PathWriter.prototype._write = function(chunk, enc, cb) {	
	if (!this._sink) {
		this.on('start', () => {
			this._sink.write(chunk, enc, cb)
			this.emit('drain')
		})
		return false
	}

	this._sink.write(chunk, enc, cb)
	return true
}

function PathReader(root) {
	if (!(this instanceof PathReader))
		return new PathReader(root)

	stream.Readable.call(this)

	/* used to read file contents */
	this._source = undefined

	/* used to read directory contents */
	this._count = 0

	fs.stat(root, (err, stat) => {
		if (err)
			throw err
		if (stat.isDirectory())
			this._processDir(root, '')
		else if (stat.isFile())
			this._processFile(root)
	})
}
PathReader.prototype._processFile = function(root) {
	this._source = fs.createReadStream(root)
	this._source.on('end', () => this.push(null))
	this._source.on('readable', () => this.read())
}
PathReader.prototype._processEntry = function(root, dir, fp) {
	this._count++
	var rel = path.join(dir, fp)
	fs.stat(path.join(root, rel), (err, stat) => {
		if (stat.isFile())
			this.push(rel)
		else if (stat.isDirectory())
			this._processDir(root, rel)

		this._count--
		if (this._count === 0)
			this.push(null)
	})
}
PathReader.prototype._processDir = function(root, dir) {
	this._count++
	fs.readdir(path.join(root, dir), (err, files) => {
		files.forEach(f => this._processEntry(root, dir, f))

		this._count--
		if (this._count === 0)
			this.push(null)
	})
}
PathReader.prototype._read = function(n) {
	var chunk = this._source ? this._source.read() : null
	if (chunk === null)
		this.push('')
	else
		this.push(chunk)
}

util.inherits(PathReader, stream.Readable)
util.inherits(PathWriter, stream.Writable)

module.exports = {
	read: PathReader,
	write: PathWriter
}