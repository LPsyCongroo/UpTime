// API

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const fs = require('fs');

const _data = require('./lib/data');

// TESTING
// @TODO delete this
_data.read('test', 'newdFile', (err, data) => {
  console.log('Error: ', err, 'Data: ', data);
});

// Server Logic for both http and https server
const unifiedServer = (req, res) => {

  // Get URL and parse it
  const parsedUrl = url.parse(req.url, true);
  
  // Get the path
  const path = parsedUrl.pathname;

  // Trim off the "/" from the path 
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get HTTP method
  const method = req.method.toUpperCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', data => {
    buffer += decoder.write(data);
  });

  /**
   * The end event is always called!
   * If there is no payload, we still send a response!
   */
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler request should go to. If one is not found, send 404
    const chosenHandler = handlers.hasOwnProperty(trimmedPath) ? 
      handlers[trimmedPath] : 
      handlers.notFound;

    // Send data objet to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode = 200, payload = {}) => {
      
      // Convert payload to string
      const payloadString = JSON.stringify(payload);

      // Return response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request
      console.log(`Request received! \n${JSON.stringify({
        statusCode: statusCode,
        payloadString: payloadString,
        payload: buffer,
        query: queryStringObject
      }, null, 2)}`);

    })
  });
}

// Instantiate HTTP server
const httpServer = http.createServer(unifiedServer);

// Start HTTP Server
httpServer.listen(config.httpPort, () => 
  console.log(`HTTP server listening on port ${config.httpPort} in ${config.envName} mode.`)
);

// Instantiate HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
};
const httpsServer = https.createServer(httpsServerOptions, unifiedServer);

// Start HTTPS server
httpsServer.listen(config.httpsPort, () => 
  console.log(`HTTPS server listening on port ${config.httpsPort} in ${config.envName} mode.`)
);

// Define handlers
const handlers = {};

// Ping handler
handlers.ping = (data, callback) => {
  callback(200)
}

// 404 not found handler
handlers.notFound = (data, callback) => {
  callback(404);
}

// Define a request router
const router = {
  'sample': handlers.sample
}