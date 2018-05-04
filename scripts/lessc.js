var path = require('path')
var less = require('less')
var Transform = require('stream').Transform
var stream = require('./iostream.js')
var ioutil = require('./ioutil.js')

/* pipe in less, get out css */
function LessStream() {
	if (!(this instanceof LessStream))
		return new LessStream()

	this._code = new Buffer([])
	Transform.call(this)
}

LessStream.prototype._transform = function(data, enc, cb) {
	this._code = Buffer.concat([this._code, data])
	cb()
}

LessStream.prototype._flush = function (cb) {
	less.render(this._code.toString('utf-8'), {
		include: "src/less/"
	}, (err, out) => {
		if (err) {
			console.error(err)
			cb()
			return
		}

		this.push(out.css)
		cb()
	})
}

require('util').inherits(LessStream, Transform)

/* render less files in serpent/src/less --> serpent/bin/css
 *
 *	file:
 *		- undefined: process less dir
 *		- relative path: only render that path/file
 */
function render(file, src, dst) {
	//used to compile all.less to all.css	
	if (file.name !== 'all.less') {
		return
	}

	ioutil.log('lessc', src, '-->', dst)

	/* xyz.less --> xyz.css */

	dst = path.join(path.dirname(dst), path.basename(file.name, file.ext))
		+ '.css'	
	stream.read(src).pipe(LessStream()).pipe(stream.write(dst))
}

module.exports = ioutil.process('./src/less/', './bin/css', render)