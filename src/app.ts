import 'reflect-metadata'; // need this in order to use @Decorators check mor here: https://github.com/typestack/typedi
import express from 'express';
import Logger from './loaders/logger';
import  http from 'http';


/**
* Normalize a port into a number, string, or false.
*/
function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
  * Event listener for HTTP server "error" event.
  */

function onError(error: any, port: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
  * Event listener for HTTP server "listening" event.
  */

function onListening(port: any) {
  var addr = port;
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr;  
  Logger.info(`⚡ Server runing at - http://localhost:${port}`);
}



async function startServer(){
    const app = express()

    /**
    * A little hack here
    * Import/Export can only be used in 'top-level code'
    * Well, at least in node 10 without babel and at the time of writing
    * So we are using good old require.
    **/
    await require('./loaders').default({ expressApp: app });

    /**
    * Get port from environment and store in Express.
    */
    let port = normalizePort(process.env.PORT || '3100');
    app.set('port', port);
    
    /**
      * Create HTTP server.
      */
    
    let server = http.createServer(app);
    
    /**
      * Listen on provided port, on all network interfaces.
      */
    
    server.listen(port, () => {
      onListening(port)
    }).on('error', (err: any) => {
      onError(err, port)
      process.exit(1);
    });
}


startServer();
