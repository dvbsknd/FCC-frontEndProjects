const PORT = 3000;
const http = require('http'),
  fs = require('fs');

const server = http.createServer((req, res) => {
  console.log('[Request]', req.url);
  const file = getFilePath(req.url);
  console.log('[File]', file);
  fs.readFile(file, (err, data) => {
    if (err) {
      res.end(err.message, console.log('[Error]', err));
    } else {
      res.writeHead(200, getContentType(req.url));
      res.end(data, console.log('[Response]', req.url));
    }
  });
});

const getFilePath = (url) => __dirname + '/challenges' + getFileName(url);
const getFileName = (url) => url;

const getContentType = (url) => {
  const fileType = url.match(/\.(html|css|js|png)$/g);
  switch (fileType[0]) {
    case '.html':
      return { 'Content-Type': 'text/html' };
    case '.css':
      return { 'Content-Type': 'text/css' };
    case '.js':
      return { 'Content-Type': 'text/javascript' };
    case '.png':
      return { 'Content-Type': 'image/png' };
    default:
      return { 'Content-Type': 'text/plain' };
  }
};

server.listen(PORT, console.log('[Status] Server is up and hot-reloading at', PORT));
