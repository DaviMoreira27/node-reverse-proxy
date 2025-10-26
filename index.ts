import * as http from "node:http";

const mappedServers = new Map<string, string>();
mappedServers.set('url/1', 'http://localhost:3001');
mappedServers.set('url/2', 'http://localhost:3002');
mappedServers.set('url/3', 'http://localhost:3003');
mappedServers.set('url/4', 'http://localhost:3004');

// Application entry point
http.createServer((req, res) => {
  console.log('Received HTTP Request');

  if (!req.url) {
    res.statusCode = 500;
    return res.end();
  }

  const { pathname } = new URL(req.url);


  mappedServers.forEach((key) => {
    if (key.includes(pathname)) {
      res.statusCode = 200;
      res.end(JSON.stringify({
        data: 'Redirected Successfully!' 
      }));
      return;
    }
  })


  res.statusCode = 404;
  res.end();
}).listen(3000);
