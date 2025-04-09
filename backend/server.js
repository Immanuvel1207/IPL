const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

require('./routes/auth')(app);
require('./routes/players')(app);
require('./routes/buyers')(app);
require('./socket/auction')(io);