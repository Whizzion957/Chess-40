import { useRef, useState } from "react";
import "./chessboard.css";
import Tile from "../Tiles/tile";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE } from "../../Constants";
import { Piece, Position } from "../../models";
import Logbook from "./logbook";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
}

export default function Chessboard({ playMove, pieces }: Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const [moves, setMoves] = useState<string[]>([]); 
  const chessboardRef = useRef<HTMLDivElement>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      // Clamp the piece position within the chessboard bounds
      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
  
      const currentPiece = pieces.find((p) => p.samePosition(grabPosition));
  
      if (currentPiece) {
        const opponentPiece = pieces.find((p) => p.samePosition(new Position(x, y)));
        const success = playMove(currentPiece.clone(), new Position(x, y));
        
  
        if (success) {
          const newPosition = new Position(x, y);
          let moveNotation = "";
          if (opponentPiece) {
            moveNotation = `${currentPiece.type} takes ${opponentPiece.type} ${positionToChessNotation(newPosition)}`;
            if (currentPiece.isKing && Math.abs(grabPosition.x - x) > 1) {
              if (x === 7) {
                moveNotation="O-O";
              } 
              else if (x === 0) {
                moveNotation = "O-O-O";
              }
            }
          } 
          else {
            moveNotation = `${currentPiece.type} ${positionToChessNotation(newPosition)}`;
            if (currentPiece.isPawn && grabPosition.x!==x) {
              moveNotation += " en passant";
            }
          }
          setMoves([...moves, moveNotation]);
        } else {
          // Reset the piece position if move is not successful
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }
      }
  
      setActivePiece(null);
    }
  }

  // Function to convert Position to chess notation (e.g., (4, 1) to "e2")
  const positionToChessNotation = (position: Position): string => {
    const file = String.fromCharCode(97 + position.x); // 'a' is ASCII 97
    const rank = position.y + 1;
    return `${file}${rank}`;
  };

  // Generating the chessboard grid
  let board = [];
  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) => p.samePosition(new Position(i, j)));
      let image = piece ? piece.image : undefined;

      let currentPiece = activePiece != null ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
      let highlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;

      board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} />);
    }
  }

  return (
    <div className="layout">
      <div className="board">
        <div className="ranks">
          {VERTICAL_AXIS.map((rank,index) => (
              <div key={`rank-${index}`} className="rank">
                {9-parseInt(rank)}
              </div>
            ))}
        </div>
        <div
          onMouseMove={(e) => movePiece(e)}
          onMouseDown={(e) => grabPiece(e)}
          onMouseUp={(e) => dropPiece(e)}
          id="chessboard"
          ref={chessboardRef}
        >
          {board}
        </div>
        <div className="files">
          {HORIZONTAL_AXIS.map((file,index) => (
            <div key={`file-${index}`} className="file">
              {file.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
      <div className="voice">
        <button>
          <span>Voice Control</span>
        </button>
      </div>
      <Logbook moves={moves} />
    </div>
  );
}


