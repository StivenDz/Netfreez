const express = require('express');
const morgan = require('morgan')
const bodyParser = require('body-parser')

const http = require('http')
const path = require('path');
const { Server } = require('socket.io');

const app = express();

const server = http.createServer(app);
const io =new Server(server);
require('./sockets')(io);

// Settings
app.set('views',path.join(__dirname,'public/views'));
app.set('view engine','ejs');
app.set('port', process.env.PORT || 7999);

const PORT = app.get('port');

// Dev tools
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

const router = require('./public/routes/index');

app.use(router);

server.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}\nVisit localhost:7999`);
});