// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');

exports.fetch = function() {
  console.log('YO');
  archive.readListOfUrls((urls) => {
    console.log('urls in fetch: ', urls);
    archive.downloadUrls(urls);
  });
};
