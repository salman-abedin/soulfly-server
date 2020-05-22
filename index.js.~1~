const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

const port = process.env.PORT || 5000;

const users = {};

const app = express();
const server = app.listen(port);

////////////////////////////////////////////////////////////////////////////////
//                             Mongoose
////////////////////////////////////////////////////////////////////////////////

const dbConString =
   process.env.MONGODB_URI ||
   'mongodb+srv://salman:pgjrdm04@cluster0-gyi3x.mongodb.net/test?retryWrites=true&w=majority';
// const dbConString = 'mongodb://localhost/chatApp';

mongoose.connect(
   dbConString,
   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
   () => console.log('connected to DB')
);

const MessageSchema = new mongoose.Schema({
   name: String,
   id: String,
   content: String,
   // timestamp: {
   //    type: Date,
   //    default: Date.now,
   // },
});

const Message = mongoose.model('Message', MessageSchema);

////////////////////////////////////////////////////////////////////////////////
//                             Routers & API
////////////////////////////////////////////////////////////////////////////////

app.use(express.json()); // JSON String to OBJECT

// // Get messages from DB
// app.get('/', (req, res) => {
//    // res.send('Server is running')
//    Message.find()
//       .then((messages) => res.json(messages))
//       .catch((e) => res.status(500).json({ message: e.message }));
// });

// // Get messages from DB
// app.post('/', (req, res) => {
//    new Message(req.body)
//       .save()
//       .then((message) => res.json(message))
//       .catch((e) => res.status(500).json({ message: e.message }));
// });

////////////////////////////////////////////////////////////////////////////////
//                             Socket
////////////////////////////////////////////////////////////////////////////////

const io = socketIO(server);
io.on('connect', (socket) => {

   socket.on('join', (name) => {
      users[socket.id] = name;
      socket.emit('init-users', Object.values(users));
      socket.broadcast.emit('usrJoin', Object.values(users), name);

      Message.find()
         .sort({ _id: -1 })
         .limit(10)
         .exec((err, messages) => {
            if (err) return console.error(err);
            console.log(messages);
            socket.emit('init-messages', messages.reverse());
         });

   });

   socket.on('message', (data) => {
      io.sockets.emit('message', data);
      new Message(data).save((err) => console.log(err));
   });

   socket.on('seen', (data) => {
      socket.broadcast.emit('seen', data);
   });

   socket.on('typing', () => {
      socket.broadcast.emit('typing');
   });

   socket.on('disconnect', () => {
      const name = users[socket.id];
      delete users[socket.id];
      io.sockets.emit('usrLeave', Object.values(users), name);
   });

});

////////////////////////////////////////////////////////////////////////////////
//                            Deployment
////////////////////////////////////////////////////////////////////////////////

app.use(cors());
