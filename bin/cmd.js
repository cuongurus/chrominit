#!/usr/bin/env node

var path = require('path')
var fs = require('fs')
var read = require('read');
var semver = require('semver')
var init = require('../index.js')
var def = require('../default.js')

var dir = process.cwd();
var name = path.basename(dir);
var input = def.manifest(name);
var win = {
  'name': 'index.html',
  'width': 620,
  'height': 500
};
console.log(
  'This utility will walk you through creating a chrome app.\n' +
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
    prompt: 'description:'
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