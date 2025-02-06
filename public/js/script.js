const socket = io();
const chess = new Chess();

const boardElement = document.querySelector('.chessboard');

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = '';
  board.forEach((row, rowindex) => {
    row.forEach((square, squareindex) => {
      const squareElement = document.createElement('div');
      squareElement.classList.add('square', rowindex + squareindex) % 2 === 0
        ? 'Light'
        : 'dark';
    });
    squareElement.dataset.row = rowindex;
    squareElement.dataset.col = squareindex;
    if (square) {
      const pieceElement = document.createElement('div');
      pieceElement.classList.add(
        'piece',
        square.color === 'w' ? 'white' : 'black',
      );

      pieceElement.innerText = '';
      pieceElement.draggedPiece = playerRole === square.color;

      pieceElement.addEventListener("'dragstart", e => {
        if (pieceElement.draggedPiece) {
          draggedPiece = pieceElement;
          sourceSquare = { row: rowindex, col: squareindex };
          e.dataTransfer.setData('text/plain', '');
        }
      });

      pieceElement.addEventListener('dragend', e => {
        draggedPiece = null;
        sourceSquare = null;
      });
      squareElement.appendChild(pieceElement);
    }

    squareElement.addEventListener('dragover', e => {
      e.preventDefault();
    });
    squareElement.addEventListener('drop', e => {
      e.preventDefault();
      if (draggedPiece) {
        const targetSource = {
          row: parseInt(squareElement.dataset.row),
          col: parseInt(squareElement.dataset.col),
        };
        handleMove(sourceSquare, targetSource);
      }
    });
    boardElement.appendChild(squareElement);
  });
};
const handleMove = () => {};

const getPieceUnicode = () => {
  const unicodePieces = {
    p: '♙',
    r: '♖',
    n: '♘',
    b: '♗',
    q: '♕',
    k: '♔',
    P: '♟',
    R: '♜',
    N: '♞',
    B: '♝',
    Q: '♛',
    K: '♚',
  };
};
renderBoard();
