'use strict';

require('dotenv').config();

const debug = require('debug')('lab-coffee-and-books:server');
const app = require('./app');
const mongoose = require('mongoose');

const PORT = parseInt(process.env.PORT, 10);
const URI = process.env.MONGODB_URI;

const terminate = (error) => {
  if (error) debug(error);
  const exitCode = error && error instanceof Error ? 1 : 0;
  debug('Terminating node app.');
  mongoose.disconnect().finally(() => {
    debug('Disconnected from database.');
    process.exit(exitCode);
  });
};

const fs = require('fs');
const filePath = './public/scripts/loadmapsapi.js';
fs.access(filePath, fs.F_OK, (err) => {
  if (err) {
    const API_KEY = process.env.API_KEY;
    const apiScriptData = `
      window.onload = function() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src =
          'https://maps.googleapis.com/maps/api/js?key=' +
          '${API_KEY}' +
          '&callback=initMap';
        script.setAttribute("defer", "defer");
        document.body.appendChild(script);
      };
      `;
    fs.writeFile('./public/scripts/loadmapsapi.js', apiScriptData, (err) => {});
    return;
  }

  //file exists
});

process.on('SIGINT', () => terminate());
process.on('SIGTERM', () => terminate());
process.on('uncaughtException', (error) => {
  debug('There was an uncaught exception.');
  terminate(error);
});
process.on('unhandledRejection', (error) => {
  debug('There was an unhandled promise rejection.');
  terminate(error);
});

const onError = (error) => {
  const { syscall, port, code } = error;
  if (syscall === 'listen' && code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  } else {
    console.error('There was an unknown error.');
    debug(error);
    throw error;
  }
};

const onListening = (server) => {
  const { port } = server.address();
  debug(`Node server listening on ${port}`);
  if (process.env.NODE_ENV === 'development')
    debug(`Visit http://localhost:${port} to develop your app`);
};

const initiate = () => {
  app.set('port', PORT);

  const server = app.listen(PORT);
  server.on('error', (error) => onError(error));
  server.on('listening', () => onListening(server));
};

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    debug(`Database connected to URI "${URI}"`);
    initiate();
  })
  .catch((error) => {
    console.error(`There was an error connecting the database to URI "${URI}"`);
    debug(error);
    process.exit(1);
  });
