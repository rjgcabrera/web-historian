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
var htmlFetcher = require('../workers/htmlfetcher.js');
// require more modules/folders here!

var headers = httpHelpers.headers;

var handleRequest = function (req, res) {
  var actions = {
    'GET': (req, res) => {
      //console.log('req.url: ', req.url);
      if (req.url === '/') {
        httpHelpers.serveAssets(res, __dirname + '/public/index.html', null);
      } else {
        console.log('req.url: ', req.url.slice(1));
        var url = req.url.slice(1);
        //console.log('file address: ', archive.paths.archivedSites + '/' + url);
        // check archive for website's index.html
          // if it's in the archive,
            //serve the index.html file (serveAssets)
          // else
            //respond with a 404
        var isArchived;
        archive.isUrlArchived(url, (bool) => {
          isArchived = bool;
          if (isArchived) {
            console.log('About to serve Assets');
            httpHelpers.serveAssets(res, archive.paths.archivedSites + '/' + url)
          } else {
            console.log('get req error');
            res.writeHead(404, httpHelpers.headers);
            res.end();
          }
        });
      }
    },
    'POST': (req, res) => {
      //if url is not in list
        // add url to list
      var url = '';
      req.on('data', (chunk) => {
        url += chunk;
      });
      req.on('end', () => {
        // var url = req;
        url = url.slice(4) + '\n';
        console.log('URL IN POST: ', url);
        var isInList;
        archive.isUrlInList(url, (bool) => {
          isInList = bool;
          if (!isInList) {
            archive.addUrlToList(url, (url) => {
              console.log('Wrote ' + url + ' to the list!');
              res.writeHead(302, httpHelpers.headers);
              res.end();
            });
          } else {
            console.log(url + ' is already in the list!');
            res.writeHead(302, httpHelpers.headers);
            res.end();
          }
        });
      });

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
