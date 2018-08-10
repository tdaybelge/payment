const http = require('http');

http.createServer((request, response) => {
  const headers = request.headers;
  const method = request.method;
  const url = request.url;
  var body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    // BEGINNING OF NEW STUFF

    response.on('error', (err) => {
      console.error(err);
    });

    if(url!=='/paymentExecution/v1') {
	 response.writeHead(404, {'Content-Type': 'application/json'});
         response.write(JSON.stringify({error: 'incorrect url'}));
    } else if(method != 'PUT') {
         response.writeHead(405, {'Content-Type': 'application/json'});
         response.write(JSON.stringify({error: 'unsupported method'}));
    } else {

       response.statusCode = 200;
       response.setHeader('Content-Type', 'application/json');
       // Note: the 2 lines above could be replaced with this next one:
       // response.writeHead(200, {'Content-Type': 'application/json'})

       //const responseBody = { headers, method, url, body };
       response.write(body);
       // Note: the 2 lines above could be replaced with this next one:
       // response.end(JSON.stringify(responseBody))

   }
   response.end();
    // END OF NEW STUFF
  });
}).listen(8080);
