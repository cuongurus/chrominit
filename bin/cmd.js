#!/usr/bin/env node

var https = require('https')
var path = require('path')
var fs = require('fs')
var read = require('read');
var semver = require('semver')
var init = require('../index.js')
var def = require('../default.js')
var program = require('commander')

var dir = process.cwd();

program
  .version('1.0.5')
  .option('-a, --app', 'Generator started Chrome app')
  .option('-z, --zeroconf', 'Install Zeroconf lib')
  .parse(process.argv)


if (program.app && !program.zeroconf) app();
if (program.zeroconf && !program.app) zeroconf();
if (program.app && program.zeroconf) {
  console.log("Too many arguments")
  process.exit(1)
}


function app() {
  var name = path.basename(dir);
  var input = def.manifest(name);
  var win = {
    'name': 'index.html',
    'width': 620,
    'height': 500
  };
  console.log(
    'This utility will walk you through creating a sample chrome app.\n' +
    'It only covers the most common items, and tries to guess sensible defaults.\n' +
    'Press ^C at any time to quit.')

  function isCancel(er) {
    if (er && er.message === 'canceled') {
      console.warn('\nCanceled!')
    }
  }

  Name();


  function Name() {
    read({
      prompt: 'name:',
      default: name
    }, function (er, n) {
      isCancel(er)
      if (n) {
        input.name = n;
        Des()
      }
    })
  }

  function Des() {
    read({
      prompt: 'description:',
      default: name
    }, function (er, des) {
      isCancel(er)
      if (des) {
        input.description = des;
        Version()
      }
    })
  }

  function Version() {
    read({
      prompt: 'version:',
      default: '1.0.0'
    }, function (er, v) {
      isCancel(er)
      if (v) {
        if (semver.valid(v)) {
          input.version = v;
          Script()
        } else {
          console.log('Invalid version: ' + v);
          Version()
        }
      }
    })
  }

  function Script() {
    read({
      prompt: 'background script:',
      default: 'background.js'
    }, function (er, b) {
      isCancel(er)
      if (b) {
        if (!b.includes('.js')) b += '.js'
        var s = input.app.background.scripts;
        s.length = 0;
        s.push(b);
        Page()
      }
    })
  }

  function Page() {
    read({
      prompt: 'window page:',
      default: 'index.html'
    }, function (er, p) {
      isCancel(er)
      if (p) {
        if (!p.includes('.html')) p += '.html'
        win.name = p;
        Width()
      }
    })
  }

  function Width() {
    read({
      prompt: 'window width:',
      default: 620
    }, function (er, w) {
      isCancel(er)
      if (w) {
        if (w == parseInt(w, 10)) {
          win.width = w;
          Height()
        } else {
          console.log('Invalid width: ' + w)
          Width()
        }
      }
    })
  }

  function Height() {
    read({
      prompt: 'window height:',
      default: 500
    }, function (er, h) {
      isCancel(er)
      if (h) {
        if (h == parseInt(h, 10)) {
          win.height = h;
          init(input, win, function (err) {
            if (err) console.log(err)
          })
        } else {
          console.log('Invalid height: ' + h)
          Height()
        }
      }
    })
  }
};

function zeroconf() {
  if (fs.existsSync(dir + "/manifest.json")) {
    console.log('This utility will install Zeroconf lib for your chrome app and add required permission to  your "manifest.json"\n');

    download();
    modify();
    console.log('Zeroconf lib installed!\n' +
      'Please import file "zeroconf.js" to your window page using script tag to use the lib!');
  } else {
    console.log("Please run 'chominit -a' to generator chrome app first!")
  }

  function download() {
    var js = fs.createWriteStream(dir + '/zeroconf.js');
    var request = https.get("https://raw.githubusercontent.com/cuongurus/Zeroconf-for-Chrome/master/src/zeroconf.js", function (res) {
      res.pipe(js);
    })
  }

  function modify() {
    var sockets = {
      "udp": {
        "bind": "*",
        "send": "*"
      }
    };
    var obj = JSON.parse(fs.readFileSync(dir + '/manifest.json', 'utf8'));
    var len = obj.length;
    obj.sockets = sockets;

    if (obj.length != len) {
      fs.writeFile('manifest.json', JSON.stringify(obj, null, 4), 'utf-8', function (er) {
        if (er) {
          console.log(er);
        }
      });
    }
  }
};