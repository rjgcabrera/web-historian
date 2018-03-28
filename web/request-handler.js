// var path = require('path');
// var archive = require('../helpers/archive-helpers');
// // require more modules/folders here!
//
// exports.handleRequest = function (req, res) {
//   res.end(archive.paths.list);
// };

var path = require('path');
var archive = require('../helpers/archive-helpers');
var http = require('http');
var url = require('url');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!

var headers = httpHelpers.headers;

var handleRequest = function (req, res) {
  var actions = {
    'GET': (req, res) => {
      httpHelpers.serveAssets(res, __dirname + '/public/index.html', null);
    },
    'POST': (req, res) => {

    },
    'OPTIONS':(req, res) => {
      res.end(archive.paths.list);

    },
  };

  var action = actions[req.method];
  if (action) {
    action(req, res);
  } else {
    sendResponse(res, 'Error Not Found', 404);
  };
}


exports.handleRequest = handleRequest;
