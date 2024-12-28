import React, { useEffect, useState } from 'react';
import ChessPiece from './ChessPiece';
import { Chess ,Square} from 'chess.js'; // Import chess.js
import { ThemeName, themes } from '../styles/themes';
import FenCode from './FenCode';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessBoard: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [theme, setTheme] = useState<ThemeName>('classic');
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [validMoveSpaces, setValidMoveSpaces] = useState<string[]>([]);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--light-square', themes[theme].lightSquare);
    root.setProperty('--dark-square', themes[theme].darkSquare);
    root.setProperty('--accent-color', themes[theme].accent);
  }, [theme]);

  const handleDragStart = (_event: React.DragEvent, from: string) => {
    setDraggedPiece(from);
  };

  const handleDrop = (event: React.DragEvent, to: string) => {
    event.preventDefault();
    if (draggedPiece) {
      const newGame = new Chess(game.fen());
      const move = newGame.move({ from: draggedPiece, to });

      if (move) {
        setGame(newGame);
      }

      setDraggedPiece(null);
      setValidMoveSpaces([]);
    }
  };

  const handleSquareClick = (position: Square) => {
    const newGame = new Chess(game.fen());
    const moves = newGame.moves({ square: position, verbose: true });
  
    // If the clicked position is in the valid moves, make the move
    if (validMoveSpaces.includes(position) && draggedPiece) {
      const move = newGame.move({ from: draggedPiece, to: position });
      if (move) {
        setGame(newGame);
      }
      setDraggedPiece(null);
      setValidMoveSpaces([]);
    } 
    // If moves are available from the clicked square, highlight them
    else if (moves.length > 0) {
      setDraggedPiece(position);
      setValidMoveSpaces(moves.map((move) => move.to));
    } 
    // If no moves are available, clear the highlights
    else {
      setDraggedPiece(null);
      setValidMoveSpaces([]);
    }
  };
  

  const renderSquare = (position: Square, piece: any, isBlack: boolean) => {
    const squareColor = isBlack ? 'bg-dark-square' : 'bg-light-square';
    
    return (
      <div
        key={position}
        id={position}
        className={`relative flex items-center justify-center ${squareColor}`}
        onDrop={(event) => handleDrop(event, position)}
        onDragOver={(event) => event.preventDefault()}
        onClick={() => handleSquareClick(position)}
        onDragStart={(event) => piece && handleDragStart(event, position)}
        role="gridcell"
        aria-label={`${position} ${piece ? `contains ${piece.color} ${piece.type}` : 'empty'}`}
        style={{ flexBasis: '12.5%' }}
      >
        {validMoveSpaces.includes(position) && (
          <div className="w-4 h-4 rounded-full bg-black opacity-20 z-20"></div>
        )}
        {piece && (
          <div
            draggable
            className="absolute w-full h-full flex items-center justify-center chess-piece"
          >
            <ChessPiece type={piece.type} color={piece.color} id={position} />
          </div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const board = game.board();

    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((square, colIndex) => {
          const position = `${files[colIndex]}${ranks[rowIndex]}` as Square;
          return renderSquare(position, square, (rowIndex + colIndex) % 2 === 1);
        })}
      </div>
    ));
  };

  const putFenCode = (fenInput:string) => {
    const newGame = new Chess(fenInput);
    if (newGame) {
      setGame(newGame);
      setValidMoveSpaces([]);
      setDraggedPiece(null);
    } else {
      alert('Invalid FEN string');
    }
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <div className="chess-board grid grid-rows-8 gap-0">{renderBoard()}</div>
      <div className="mt-4">
        <div className="flex items-center max-w-lg mx-auto">

        <label htmlFor="theme-select" className="block mb-2 text-sm font-medium">
          Select Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeName)}
          className="border border-gray-300 text-sm rounded-lg p-2"
          >
          {Object.keys(themes).map((themeName) => (
            <option key={themeName} value={themeName}>
              {themeName}
            </option>
          ))}
        </select>
          </div>
        <FenCode putFenCode={putFenCode}></FenCode>
      </div>
      {/* Moves List */}
      <div className="moves">
        <h3>Moves:{game.history().length}</h3>
        <ul>
          {game.history().map((move, index) => (
            <li key={index}>{move}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChessBoard;
