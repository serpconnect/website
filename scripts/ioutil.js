var path = require('path')
var fs = require('fs')
var stream = require('./iostream.js')

/* write data from src to dst, creating dirs as needed */
function copy(src, dst) {
	stream.read(src).pipe(stream.write(dst))
}

/* write data to file path, creating directories as needed */
function write_file(dst, data) {
	stream.write(dst).write(data)
}

/* apply ANSI coloring to first argument, then pass to console.log */
function color_log () {
	var name = '\u001b[35m' + arguments[0] + '\u001b[39m'

	var args = [name]
	for (var i = 1; i < arguments.length; i++)
		args.push(arguments[i])

	console.log.apply(this, args)
}

function for_files(src, dst, exec) {
	var process = function(fp) {
		var file = {
			name: path.basename(fp),
			ext: path.extname(fp),
			dir: path.dirname(fp)
		}
		exec(file, path.join(src, fp), path.join(dst, fp))
	}

	return function(file) {
		if (file)
			process(file)
		else
			stream.read(src).on('data', (file) => process(file.toString()))
	}
}

module.exports = {
	writeFile: write_file,
	log: color_log,
	copy: copy,
	process: for_files
}
