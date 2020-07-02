const PORT = 3000;
const http = require('http'),
  fs = require('fs');

const server = http.createServer((req, res) => {
  console.log('[Request]', req.url);
  fs.readFile(findFile(req.url), (err, data) => {
    if (err) {
      res.end(err.message, console.log('[Error]', err));
    } else {
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data, console.log('[Response]', req.url));
    }
  });
});

const findFile = (url) => __dirname + '/challenges' + url;

server.listen(PORT, console.log('[Status] Server is up and hot-refreshing at', PORT));
