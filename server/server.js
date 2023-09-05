const express = require('express');
const app = express();
const connectDB = require('./database/db');
const bodyParser = require('body-parser');
const router = require('./router/route');
const post = require('./router/postUser');
const Chat = require('./router/chatRoute');
const Message = require('./router/messageRoute');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));


app.use('/bullo/userApi', router);
app.use('/bullo/posetApi', post);
app.use('/bullo/ChatApi', Chat);
app.use('/bullo/MessageApi', Message);

const start = async (req, res) => {
  try {
    await connectDB();
    server.listen(process.env.PORT, (req, res) => {
      console.log(`Server connected to port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();