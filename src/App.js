import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = `You are at move #${move}`;
      return (
        <li key={move}>
          <div>{description}</div>
        </li>
      );
    } else if (move > 0) {
      description = `Go to move #${move}`;
    } else {
      description = `Go to game start`;
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleSortOrder}>Toggle Sort Order</button>
        <ul>{sortedMoves}</ul>
      </div>
      <div className="game-info"></div>
    </div>
  );
}

function Square({value, onSquareClick}) {

  return (<button className="square" onClick={onSquareClick}>{value}</button>);
}

function Board({xIsNext, squares, onPlay}) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  function renderSquare(i) {
    return <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)}/>
  }

  function renderRow(row) {
    const squares = [];
    for (let j = 0; j < 3; j++) {
      const index = row * 3 + j;
      squares.push(renderSquare(index));
    }
    return <div key={row} className="board-row">{squares}</div>;
  }

  const rows = [];
    for (let i = 0; i < 3; i++) {
    rows.push(renderRow(i));
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
