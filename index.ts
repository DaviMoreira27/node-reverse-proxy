import * as http from "node:http";

const mappedServers = new Map<string, string>();
mappedServers.set('/url/1', 'http://127.0.0.1:3001/json');
mappedServers.set('/url/2', 'http://127.0.0.1:3001/status/204');
mappedServers.set('/url/3', 'http://127.0.0.1:3001/get');
mappedServers.set('/url/4', 'http://127.0.0.1:3001/bearer');

/*
Get the mapped route for a given call.
This could be implemnted using the Location header
or a more robust and configurable logic (to be added)
*/
function getDestination(pathname: string) {
  console.log(`Pathname:`, pathname)
  const destination = mappedServers.get(pathname);

  if (!destination) {
    return null;
  }

  return destination;
}


// Application entry point
http.createServer((req, res) => {
    console.log("Received HTTP Request");
      if (!req.url) {
        res.statusCode = 500;
        res.end(`Internal Server Error`);
        return;
      }

      const destinationServer = getDestination(req.url);

      // Then we check to see if there is a mapped route
      // for the request using their URL
      if (!destinationServer) {
        res.statusCode = 404;
        res.end(`Not Found`);
        return;
      }

    try {
      const { port, hostname, pathname, href } = new URL(destinationServer);
      const options: http.RequestOptions = {
        hostname: hostname,
        port: port,
        path: href,
        method: req.method,
        headers: {
          ...req.headers,
          "x-forwarded-for": req.socket.remoteAddress,
          "x-forwarded-host": req.headers.host,
        },
      };

      console.log('Proxy options', options);

      // Here the request is proxied to the correct server
      // Its making a request on behalf of the client
      const proxyReq = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
        // Here the response is being piped to the proxyReq variable
        proxyRes.pipe(res, { end: true });
      });

      // If an error happens we send back just a Bad Gateway error
      // This will be improved, because if the server returns an error
      // 5xx it will probably have the same destiny as any error that
      // is caused by this proxy.
      proxyReq.on("error", (err) => {
        console.error("Proxy error:", err);
        res.writeHead(502);
        res.end("Bad Gateway");
      });

      console.log(`Request proxied successfully`)
      // If everything occurs correctly
      // then the stored server response will be streamed to the client
      req.pipe(proxyReq, { end: true });
    } catch(error) {
      console.error('Error parsing URL', error);
      res.statusCode = 500;
      res.end(`Internal Server Error`);
      return;
    }
}).listen(3000);
