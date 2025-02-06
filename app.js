const express = require('express');

const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');
const { title } = require('process');
const app = express();
const port = process.env.PORT || 4000;

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayer = 'w';
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Checkmate-Hub',
  });
});

io.on('connection', function (UniquesSocket) {
  console.log('connection dane');

  if (!players.white) {
    players.white = UniquesSocket.id;
    UniquesSocket.emit('playerRole', 'w');
  } else if (!players.black) {
    players.black = UniquesSocket.id;
    UniquesSocket.emit('playerRole', 'b');
  } else {
    UniquesSocket.emit('spectatorRole');
  }

  UniquesSocket.on('disconnect', function () {
    if (UniquesSocket.id === players.white) {
      delete players.white;
    } else if (UniquesSocket.id === players.black) {
      delete players.black;
    }
  });

  UniquesSocket.on('move', move => {
    try {
      if (chess.turn() === 'w' && UniquesSocket.id !== players.white) return;
      if (chess.turn() === 'b' && UniquesSocket.id !== players.black) return;
      const result = chess.move(move);
      if (result) {
        currentPlayer.chess.turn();
        io.emit('move', move);
        io.emit('boardState', chess.fen());
      } else {
        console.log('invalid Move :', move);
        UniquesSocket.emit('invalid Move :', move);
      }
    } catch (error) {
      console.log(error);
      UniquesSocket.emit('invalid Move :', move);
    }
  });
});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
