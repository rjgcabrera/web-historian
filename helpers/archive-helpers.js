var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var request = require('request');
// var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile (exports.paths.list, 'utf-8', (err, data) => {
    if (err) {
      throw err;
    } else {
      callback(data.split('\n'));
    }
  });
};

exports.isUrlInList = function(url, callback) {
  //var bool = false;
  fs.readFile (exports.paths.list, 'utf-8', (err, data) => {
    if (err) {
      throw err;
    } else {
      data = data.trim();
      var urlList = data.split('\n');
      // console.log('ISURLINLIST ARR:', urlList.includes(url.trim()));
      callback(urlList.includes(url.trim()));
    }
  });
};

exports.addUrlToList = function(url, callback) {
  if (url.slice(0, 3) === 'www') {
    fs.appendFile(exports.paths.list, url, 'utf-8', (err) => {
      if (err) {
        throw err;
      } else {
        //console.log('URL: ', url);
        callback(url);
      }

    });
  }

};

//requires implementation of your web worker?
exports.isUrlArchived = function(url, callback) {
  fs.stat(exports.paths.archivedSites + '/' + url.trim(), function(err, stat) {
      if (err === null) {
        callback(true);
      } else {
        callback(false);
      }

  });
};

// exports.downloadUrls = function(urls) {
//   urls.pop();
//   for (var i = 0; i < urls.length; i++) {
//     // console.log('urls[i]: ', urls[i]);
//     var url = urls[i];
//     console.log('dlURL url: ', url);
//     exports.isUrlArchived(url, (bool) => {
//       console.log('urls['+i+']: ', url);
//       if (bool === false) {
//         //console.log('yo');
//         var options = {
//           host: url,
//           port: 80,
//           path: '/index.html'
//         };
//         console.log('options: ', JSON.stringify(options));
//         var body = '';
//         http.get(options, (res) => {
//           // fs.writeFile();
//           //console.log('get response in dlUrls: ', res);
//           res.on('data', (chunk) => {
//             body += chunk;
//           });
//           res.on('end', () => {
//             console.log('BODY INSIDE DLURL: ', body);
//             fs.writeFile(exports.paths.archivedSites + '/' + url, body, (err) => {
//               if (err) {
//                 console.log(err);
//               }
//             });
//           });
//         });
//
//       }
//     });
//
//   }
//
// };

exports.downloadUrls = function(urls) {
  // Iterate over urls and pipe to new files
  urls.pop();
  _.each(urls, function (url) {
    if (!url) { return; }
    request({url: 'http://' + url, followAllRedirects: true}).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};
