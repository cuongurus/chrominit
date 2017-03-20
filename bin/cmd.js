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

Name();


function Name() {
  read({
    prompt: 'name',
    default: name
  }, function (er, n) {
    if (n) {
      input.name = n;
    }
    Des()
  })
}

function Des() {
  read({
    prompt: 'description:'
  }, function (er, des) {
    if (des) {
      input.description = des;
    }
    Version()
  })
}

function Version() {
  read({
    prompt: 'version:',
    default: '1.0.0'
  }, function (er, v) {
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
    if (b) {
      if (!b.includes('.js')) b += '.js'
      var s = input.app.background.scripts;
      s.length = 0;
      s.push(b);
    }
    Page()
  })
}

function Page() {
  read({
    prompt: 'window page:',
    default: 'index.html'
  }, function (er, p) {
    if (p) {
      if (!p.includes('.html')) p += '.html'
      win.name = p;
    }
    Width()
  })
}

function Width() {
  read({
    prompt: 'window width:',
    default: 620
  }, function (er, w) {
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