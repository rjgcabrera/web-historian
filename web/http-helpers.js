var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

    // var status = 200;
    // fs.readFile (asset, 'utf-8', (err, data) => {
    //   if (err) {
    //     console.log('readFile failed', err);
    //     status = 404;
    //     data = 'Error Not Found';
    //     throw err;
    //   } else {
    //     console.log('readFile success');
    //     res.writeHead(status, exports.headers);
    //     res.end(data);
    //   }
    // });

//-----------------------------
    fs.readFile(archive.paths.siteAssets + asset, 'utf-8', (err, data) => {
      if (err) {
        fs.readFile(archive.paths.archivedSites + asset, 'utf-8', (err, data) => {
          if (err) {
            callback ? callback() : exports.sendResponse(res, 'Not Found', 404);
          } else {
            exports.sendResponse(res, data);
          }
        });
      } else {
        exports.sendResponse(res, data);
      }
    });

};

// As you progress, keep thinking about what helper functions you can put here!

exports.sendResponse = function(response, obj, status) {
  status = status || 200;
  response.writeHead(status, exports.headers);
  response.end(obj);
};

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};
