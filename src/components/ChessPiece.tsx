
export enum  PieceType  {
  None=0,
  King=1,
  Pawn=2,
  Knight=3,
  Bishop=4,
  Rook=5,
  Queen=6,
}
export enum PieceColor {
  White=8,
  Black=16
}

interface ChessPieceProps {
  type: PieceType
  color: PieceColor
  id:string
}
type PieceMapper = {
  [key: number]: string;
};

const ChessPiece: React.FC<ChessPieceProps> = ({ type, color,id }) => {
  
  const mapper:PieceMapper = {
    17:'♚',
    18:'♟',
    19:'♞',
    20:'♝',
    21:'♜',
    22:'♛',
    9:'♔',
    10:'♙',
    11:'♘',
    12:'♗',
    13:'♖',
    14:'♕'
  }
  
  return (
    <div id={id} className="w-full h-full flex items-center justify-center">
      <img
        draggable='true'
        src={`/pieces/chess_pieces/${color}${type}.png`}
        alt={`${mapper[color+type]}`}
        className="max-w-full max-h-full"
      />
    </div>
  )
}

export default ChessPiece

