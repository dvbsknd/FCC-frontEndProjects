const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end('Hey.', console.log('Responded to', req.url));
});
server.listen(3000, console.log('Server is up at 3000'));
