const chessboard = document.querySelector(".chessboard");

const pieces = {
  white: {
    king: "&#9812;",
    queen: "&#9813;",
    rook: "&#9814;",
    bishop: "&#9815;",
    knight: "&#9816;",
    pawn: "&#9817;",
  },
  black: {
    king: "&#9818;",
    queen: "&#9819;",
    rook: "&#9820;",
    bishop: "&#9821;",
    knight: "&#9822;",
    pawn: "&#9823;",
  },
};

const initialBoard = [
  ["black.rook", "black.knight", "black.bishop", "black.queen", "black.king", "black.bishop", "black.knight", "black.rook"],
  ["black.pawn", "black.pawn", "black.pawn", "black.pawn", "black.pawn", "black.pawn", "black.pawn", "black.pawn"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["white.pawn", "white.pawn", "white.pawn", "white.pawn", "white.pawn", "white.pawn", "white.pawn", "white.pawn"],
  ["white.rook", "white.knight", "white.bishop", "white.queen", "white.king", "white.bishop", "white.knight", "white.rook"],
];

let currentTurn = "white";
let selectedPiece = null;

function createChessboard() {
  chessboard.innerHTML = "";

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square", (row + col) % 2 === 0 ? "light" : "dark");
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = initialBoard[row][col];
      if (piece) {
        const [color, type] = piece.split(".");
        square.innerHTML = `<span class="piece" data-color="${color}" data-type="${type}" data-row="${row}" data-col="${col}">${pieces[color][type]}</span>`;
      }

      chessboard.appendChild(square);
    }
  }
}

function isValidMove(startRow, startCol, endRow, endCol, pieceType, color) {
  const rowDiff = endRow - startRow;
  const colDiff = endCol - startCol;

  switch (pieceType) {
    case "pawn":
      return color === "white" ? rowDiff === -1 && colDiff === 0 : rowDiff === 1 && colDiff === 0;
    case "rook":
      return rowDiff === 0 || colDiff === 0;
    case "knight":
      return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
    case "bishop":
      return Math.abs(rowDiff) === Math.abs(colDiff);
    case "queen":
      return rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff);
    case "king":
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
    default:
      return false;
  }
}

function highlightMoves(piece, row, col) {
  const type = piece.dataset.type;
  const color = piece.dataset.color;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const square = document.querySelector(`.square[data-row="${r}"][data-col="${c}"]`);
      if (isValidMove(row, col, r, c, type, color)) {
        square.classList.add("highlight");
      }
    }
  }
}

function clearHighlights() {
  document.querySelectorAll(".highlight").forEach((square) => {
    square.classList.remove("highlight");
  });
}

function handleSquareClick(e) {
  const target = e.target.closest(".square");
  if (!target) return;

  const piece = target.querySelector(".piece");
  const row = parseInt(target.dataset.row);
  const col = parseInt(target.dataset.col);

  if (selectedPiece) {
    const startRow = parseInt(selectedPiece.dataset.row);
    const startCol = parseInt(selectedPiece.dataset.col);

    if (isValidMove(startRow, startCol, row, col, selectedPiece.dataset.type, selectedPiece.dataset.color)) {
      const startSquare = document.querySelector(`.square[data-row="${startRow}"][data-col="${startCol}"]`);
      startSquare.innerHTML = "";
      target.innerHTML = "";
      target.appendChild(selectedPiece);

      selectedPiece.dataset.row = row;
      selectedPiece.dataset.col = col;

      currentTurn = currentTurn === "white" ? "black" : "white";
      selectedPiece = null;
      clearHighlights();
    } else {
      alert("Invalid move!");
    }
  } else if (piece && piece.dataset.color === currentTurn) {
    selectedPiece = piece;
    clearHighlights();
    highlightMoves(piece, row, col);
  }
}

function enableInteractions() {
  chessboard.addEventListener("click", handleSquareClick);
}

createChessboard();
enableInteractions();
