import React, { useEffect, useState } from 'react';
import ChessPiece, { PieceColor, PieceType } from './ChessPiece';
import { ThemeName, themes } from '../styles/themes';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import FenCode from './FenCode';

gsap.registerPlugin(CSSPlugin);

interface Piece {
  type: PieceType;
  color: PieceColor;
}

const initialBoard: any[][] = [
  [
    { type: PieceType.Rook, color: PieceColor.Black },
    { type: PieceType.Knight, color: PieceColor.Black },
    { type: PieceType.Bishop, color: PieceColor.Black },
    { type: PieceType.Queen, color: PieceColor.Black },
    { type: PieceType.King, color: PieceColor.Black },
    { type: PieceType.Bishop, color: PieceColor.Black },
    { type: PieceType.Knight, color: PieceColor.Black },
    { type: PieceType.Rook, color: PieceColor.Black },
  ],
  Array(8).fill({ type: PieceType.Pawn, color: PieceColor.Black }),
  ...Array(4).fill(Array(8).fill(null)),
  Array(8).fill({ type: PieceType.Pawn, color: PieceColor.White }),
  [
    { type: PieceType.Rook, color: PieceColor.White },
    { type: PieceType.Knight, color: PieceColor.White },
    { type: PieceType.Bishop, color: PieceColor.White },
    { type: PieceType.Queen, color: PieceColor.White },
    { type: PieceType.King, color: PieceColor.White },
    { type: PieceType.Bishop, color: PieceColor.White },
    { type: PieceType.Knight, color: PieceColor.White },
    { type: PieceType.Rook, color: PieceColor.White },
  ],
];

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
const pieceMap: any = {
  'R': { type: PieceType.Rook, color: PieceColor.White },
  'N': { type: PieceType.Knight, color: PieceColor.White },
  'B': { type: PieceType.Bishop, color: PieceColor.White },
  'Q': { type: PieceType.Queen, color: PieceColor.White },
  'P': { type: PieceType.Pawn, color: PieceColor.White },
  'K': { type: PieceType.King, color: PieceColor.White },
  'r': { type: PieceType.Rook, color: PieceColor.Black },
  'n': { type: PieceType.Knight, color: PieceColor.Black },
  'b': { type: PieceType.Bishop, color: PieceColor.Black },
  'q': { type: PieceType.Queen, color: PieceColor.Black },
  'k': { type: PieceType.King, color: PieceColor.Black },
  'p': { type: PieceType.Pawn, color: PieceColor.Black },

}

const ChessBoard: React.FC = () => {
  const [pieces, setPieces] = useState<any[][]>(initialBoard);
  const [theme, setTheme] = useState<ThemeName>('classic');
  const [draggedPiece, setDraggedPiece] = useState<{ from: string } | null>(null);
  const [validMoveSpace, setValidMoveSpace] = useState([])

  useEffect(() => {
    const root = document.documentElement.style;    
      root.setProperty('--light-square', themes[theme].lightSquare),
      root.setProperty('--dark-square', themes[theme].darkSquare)
      root.setProperty('--accent-color', themes[theme].accent)

    return () => {}
  }, [theme])
  
  function getValidMove(piece: Piece, position: string, pieces: any[][]) {
    const [row, col] = getPositionFromBoard(position);
    const [alpha, digit] = [position[0], parseInt(position[1])];
  
    const validMoves: string[] = [];
    
    // Helper function to check board bounds
    const isWithinBounds = (row: number, col: number) =>
      row >= 0 && row < 8 && col >= 0 && col < 8;
  
    // Generate moves based on piece type and color
    switch (piece.type) {
      case PieceType.Pawn:
        if (piece.color === PieceColor.Black) {
          const forward = `${alpha}${digit - 1}`;
          const doubleForward = digit === 7 ? `${alpha}${digit - 2}` : null;
          const takeLeft = String.fromCharCode(alpha.charCodeAt(0) - 1) + (digit - 1);
          const takeRight = String.fromCharCode(alpha.charCodeAt(0) + 1) + (digit - 1);
  
          // Add forward moves if empty
          if (!getPieceFromBoard(forward, pieces)) validMoves.push(forward);
          if (doubleForward && !getPieceFromBoard(doubleForward, pieces)) validMoves.push(doubleForward);
  
          // Add diagonal captures
          if (getPieceFromBoard(takeLeft, pieces)) validMoves.push(takeLeft);
          if (getPieceFromBoard(takeRight, pieces)) validMoves.push(takeRight);
        } else if (piece.color === PieceColor.White) {
          const forward = `${alpha}${digit + 1}`;
          const doubleForward = digit === 2 ? `${alpha}${digit + 2}` : null;
          const takeLeft = String.fromCharCode(alpha.charCodeAt(0) - 1) + (digit + 1);
          const takeRight = String.fromCharCode(alpha.charCodeAt(0) + 1) + (digit + 1);
  
          // Add forward moves if empty
          if (!getPieceFromBoard(forward, pieces)) validMoves.push(forward);
          if (doubleForward && !getPieceFromBoard(doubleForward, pieces)) validMoves.push(doubleForward);
  
          // Add diagonal captures
          if (getPieceFromBoard(takeLeft, pieces)) validMoves.push(takeLeft);
          if (getPieceFromBoard(takeRight, pieces)) validMoves.push(takeRight);
        }
        break;
  
      default:
        console.log("Piece type not handled:", piece.type);
        break;
    }
  
    console.log("Valid Moves:", validMoves);
    return validMoves;
  }
  

  const getPositionFromBoard = (position: string) => [
    8 - parseInt(position[1]),
    position.charCodeAt(0) - 97,
  ];
  const getPieceFromBoard = (position: string,pieces:Piece[][]):Piece => {
    const[row,col]=getPositionFromBoard(position);
    console.log([row,col]);
    
    return pieces[row][col];
  }
  
  function putFenCode(fenCode: string) {
    const chunks = fenCode.trim().split('/');

    const fenBoard = chunks.map((code) => {
      const row:any[] = [];
      for (let char of code) {
        const num = parseInt(char);
        if (!isNaN(num)) {
          // Directly add `null` elements without creating an intermediate array
          row.push(...new Array(num).fill(null));
        } else {
          row.push(pieceMap[char]);
        }
      }
      if (row.length !== 8) {
        throw new Error('Invalid Fancode');
      }
      return row;
    });
    setPieces(fenBoard);
  }

  const movePiece = (from: string, to: string) => {
    const [fromRow, fromCol] = getPositionFromBoard(from);
    const [toRow, toCol] = getPositionFromBoard(to);

    const fromElement = document.getElementById(from); // Get the DOM element for the "from" position
    const toElement = document.getElementById(to);     // Get the DOM element for the "to" position

    if (fromElement && toElement && pieces[fromRow][fromCol]) {
      const pieceElement = fromElement.querySelector('.chess-piece'); // Class for ChessPiece

      if (pieceElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();

        // Calculate the offset
        const deltaX = toRect.left - fromRect.left;
        const deltaY = toRect.top - fromRect.top;

        // Animate the piece using GSAP
        gsap.to(pieceElement, {
          x: deltaX,
          y: deltaY,
          duration: 0.5,
          onComplete: () => {
            // Update the state once animation is complete
            const updatedPieces = pieces.map((row) => [...row]);
            const piece = updatedPieces[fromRow][fromCol];
            updatedPieces[fromRow][fromCol] = null;
            updatedPieces[toRow][toCol] = piece;
            setPieces(updatedPieces);
            
                    // Reset the piece's position after the animation
                    gsap.set(pieceElement, { x: 0, y: 0, opacity: 0 }); // Fade the piece back in at the new position

                    // Reset piece's transform to default position
                    // gsap.set(pieceElement, { position: 'relative' });
                  },
        });
      }
    }
  }

  const handleDragStart = (event: React.DragEvent, position: string) => {
    setDraggedPiece({ from: position });
  
    // Add dragging class
    const pieceElement = event.currentTarget.querySelector('.chess-piece');
    if (pieceElement) {
      pieceElement.classList.add('dragging');
    }
  };
  

  const handleDrop = (event: React.DragEvent, to: string) => {
    event.preventDefault();
    if (draggedPiece) {
      movePiece(draggedPiece.from, to);
      setDraggedPiece(null);
    }
  };

  const renderSquare = (piece: Piece | null, isBlack: boolean, row: number, col: number) => {
    const squareColor = isBlack ? 'bg-dark-square' : 'bg-light-square';
    const position = `${files[col]}${ranks[row]}`;

    return (
      <div
        key={position}
        id={position}
        className={`relative flex items-center justify-center ${squareColor}`}
        onDrop={(event) => handleDrop(event, position)}
        onDragOver={(event) => event.preventDefault()}
        onDragStart={(event) => handleDragStart(event, position)}
        role="gridcell"
        aria-label={`${position} ${piece ? `contains ${piece.color} ${piece.type}` : 'empty'}`}
        style={{ flexBasis: '12.5%' }} // Ensures each square takes up 12.5% of the width (i.e., 8 squares per row)
      >
        {piece && (
          <div onClick={()=>getValidMove(piece,position,pieces)} className="absolute w-full h-full flex items-center justify-center chess-piece">
            <ChessPiece id={position} type={piece.type} color={piece.color} />
          </div>
        )}
      </div>
    );
  };

  const renderRankLabel = (rank: string) => (
    <div key={rank} className="flex items-center justify-center font-bold text-accent" style={{ flexBasis: '12.5%' }}>
      {rank}
    </div>
  );

  const renderFileLabel = (file: string) => (
    <div key={file} className="flex items-center justify-center font-bold text-accent" style={{ flexBasis: '12.5%' }}>
      {file}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
     
      <div
        className="chess-board grid grid-rows-9 gap-0 "
        style={
          {
            '--light-square': themes[theme].lightSquare,
            '--dark-square': themes[theme].darkSquare,
            '--accent-color': themes[theme].accent,
          } as React.CSSProperties
        }
      >
        <div className="flex">{files.map(renderFileLabel)}</div>
        {pieces.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {renderRankLabel(ranks[rowIndex])}
            {row.map((piece, colIndex) => renderSquare(piece, (rowIndex + colIndex) % 2 === 1, rowIndex, colIndex))}
            {renderRankLabel(ranks[rowIndex])}
          </div>
        ))}
        <div className="flex">{files.map(renderFileLabel)}</div>
      </div>  
      <div className="mt-4">

        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
        <select className="light-square border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as ThemeName)}
        >
          {Object.keys(themes).map((themeName) => (
            <option key={themeName} value={themeName}>
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
            </option>
          ))}
        </select>
        <FenCode putFenCode={putFenCode}></FenCode>
      </div>
    </div>
  );
};

export default ChessBoard;
