var fs = require('fs')
var read = require('read')
var def = require('./default.js')

module.exports = init

function init(input, window, callback) {
    this.cb = callback;
    if (!input) cb('Require input not given')
    if (!window) cb('Require window not given')
    var d = JSON.stringify(input, null, 2) + '\n'

    function wr_manifest() {
        fs.writeFile('manifest.json', d, 'utf-8', function (er) {
            cb(er)
        })
    }

    function wr_script() {
        fs.writeFile('background.js', def.script(window), 'utf-8', function (er) {
            cb(er)
        })
    }

    function wr_win() {
        fs.writeFile(window.name, def.window(input.name), 'utf-8', function (er) {
            cb(er)
        })
    }
    console.log('About to write to manifest.json \n' + d)
    read({
        prompt: 'Is this ok? ',
        default: 'yes'
    }, function (er, ok) {
        if (!ok || ok.toLowerCase().charAt(0) !== 'y') {
            console.log('Aborted.')
        } else {
            wr_manifest()
            wr_script()
            wr_win()
        }
    })

}