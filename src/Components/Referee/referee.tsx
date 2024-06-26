import axios from 'axios';
import React, { FC, useEffect, useRef, useState } from 'react';
import { initialBoard } from "../../Constants";
import { Piece, Position } from "../../models";
import { Board } from "../../models/Board";
import { Pawn } from "../../models/Pawn";
import { bishopMove, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../../Referee/rules/";
import { PieceType, TeamType } from "../../Types";
import Chessboard from "../Chessboard/chessboard";

const Referee: FC = () => {
    var iniboard = initialBoard.clone();
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(()=>{
        const ExpressScript = async () => {
            try {
                const response = await axios.post('http://localhost:4000/chess');
                const response2 = await axios.post('http://localhost:4000/turn');
                iniboard.updateTurns(response2.data[0]["x"]);
                if(response.data){
                    let x = response.data;
                    var W_Pawn: number[] = [];
                    var W_Bishop: number[] = [];
                    var W_Rook: number[] = [];
                    var W_Knight: number[] = [];
                    var W_King: number = -1;
                    var W_Queen: number = -1;
                    var B_Pawn: number[] = [];
                    var B_Bishop: number[] = [];
                    var B_Rook: number[] = [];
                    var B_Knight: number[] = [];
                    var B_King: number = -1;
                    var B_Queen: number = -1;
                    for (const key in x) {
                        if (Object.prototype.hasOwnProperty.call(x, key)) {
                            switch (x[key]["Element"]) {
                                case "B_Pawn":
                                    B_Pawn.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "W_Pawn":
                                    W_Pawn.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "B_Bishop":
                                    B_Bishop.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "W_Bishop":
                                    W_Bishop.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "B_Rook":
                                    B_Rook.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "W_Rook":
                                    W_Rook.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "B_Knight":
                                    B_Knight.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "W_Knight":
                                    W_Knight.push((x[key]["PositionX"]*10)+x[key]["PositionY"]);
                                    break;
                                case "B_King":
                                    B_King= (x[key]["PositionX"]*10)+x[key]["PositionY"];
                                    break;
                                case "W_King":
                                    W_King= (x[key]["PositionX"]*10)+x[key]["PositionY"];
                                    break;
                                case "B_Queen":
                                    B_Queen= (x[key]["PositionX"]*10)+x[key]["PositionY"];
                                    break;
                                case "W_Queen":
                                    W_Queen= (x[key]["PositionX"]*10)+x[key]["PositionY"];
                                    break;
                            }
                        }
                    }
                    var wr=0;
                    var br=0;
                    var wk=0;
                    var bk=0;
                    var wb=0;
                    var bb=0;
                    var wp=0;
                    var bp=0;
                    for (const p of iniboard.pieces) {
                        if(p.team=='W'){
                            if(p.type=='Rook') {p.position.updateposition((W_Rook[wr]-W_Rook[wr]%10)/10,W_Rook[wr]%10);wr++}
                            else if(p.type=='Knight') {p.position.updateposition((W_Knight[wk]-W_Knight[wk]%10)/10,W_Knight[wk]%10);wk++}
                            else if(p.type=='Bishop') {p.position.updateposition((W_Bishop[wb]-W_Bishop[wb]%10)/10,W_Bishop[wb]%10);wb++}
                            else if(p.type=='Pawn') {p.position.updateposition((W_Pawn[wp]-W_Pawn[wp]%10)/10,W_Pawn[wp]%10);wp++}
                            else if(p.type=='King') {p.position.updateposition((W_King-W_King%10)/10,W_King%10);}
                            else if(p.type=='Queen') {p.position.updateposition((W_Queen-W_Queen%10)/10,W_Queen%10);}
                        }
                        else{
                            if(p.type=='Rook') {p.position.updateposition((B_Rook[br]-B_Rook[br]%10)/10,B_Rook[br]%10);br++}
                            else if(p.type=='Knight') {p.position.updateposition((B_Knight[bk]-B_Knight[bk]%10)/10,B_Knight[bk]%10);bk++}
                            else if(p.type=='Bishop') {p.position.updateposition((B_Bishop[bb]-B_Bishop[bb]%10)/10,B_Bishop[bb]%10);bb++}
                            else if(p.type=='Pawn') {p.position.updateposition((B_Pawn[bp]-B_Pawn[bp]%10)/10,B_Pawn[bp]%10);bp++}
                            else if(p.type=='King') {p.position.updateposition((B_King-B_King%10)/10,B_King%10);}
                            else if(p.type=='Queen') {p.position.updateposition((B_Queen-B_Queen%10)/10,B_Queen%10);}
                        }
                    }
                    iniboard.calculateAllMoves();
                    setIsLoaded(true);
                }
            } catch (error) {
                console.error('Error running script:', error);
            }
        };
        ExpressScript();
    },[])

    const [board, setBoard] = useState<Board>(iniboard);
    const [promotionPawn, setPromotionPawn] = useState<Piece>();
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);

    const runScript = async () => {
        try {
            const response = await axios.post<{ output: string, error: string }>('http://localhost:5000/run-script');
            console.log('Output:', response.data);
        } catch (error) {
            console.error('Error running script:', error);
        }
    };
    function playMove(playedPiece: Piece, destination: Position): number {
        // console.log(playedPiece.possibleMoves);
        // If the playing piece doesn't have any moves return
        if (playedPiece.possibleMoves === undefined) return 0;

        // Prevent the inactive team from playing
        if (playedPiece.team === TeamType.OUR
            && board.totalTurns % 2 !== 1) return 0;
        if (playedPiece.team === TeamType.OPPONENT
            && board.totalTurns % 2 !== 0) return 0;

        let playedMoveIsValid = false;
        let turn=0;

        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

        if (!validMove) return 0;

        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );

        // playMove modifies the board thus we
        // need to call setBoard
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns += 1;
            turn = clonedBoard.totalTurns;
            // Playing the move
            playedMoveIsValid = clonedBoard.playMove(enPassantMove,
                validMove, playedPiece,
                destination);

            if (clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
            }

            return clonedBoard;
        })

        // This is for promoting a pawn
        let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

        if (destination.y === promotionRow && playedPiece.isPawn) {
            modalRef.current?.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn) => {
                const clonedPlayedPiece = playedPiece.clone();
                clonedPlayedPiece.position = destination.clone();
                return clonedPlayedPiece;
            });
        }

        if(playedMoveIsValid) return turn;
        else return 0;
    }

    function isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType
    ) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if (
                (desiredPosition.x - initialPosition.x === -1 ||
                    desiredPosition.x - initialPosition.x === 1) &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                const piece = board.pieces.find(
                    (p) =>
                        p.position.x === desiredPosition.x &&
                        p.position.y === desiredPosition.y - pawnDirection &&
                        p.isPawn &&
                        (p as Pawn).enPassant
                );
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }

    //TODO
    //Add stalemate!
    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
        }

        return validMove;
    }

    function promotePawn(pieceType: PieceType) {
        if (promotionPawn === undefined) {
            return;
        }

        setBoard((previousBoard) => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if (piece.samePiecePosition(promotionPawn)) {
                    results.push(new Piece(piece.position.clone(), pieceType,
                        piece.team, true));
                } else {
                    results.push(piece);
                }
                return results;
            }, [] as Piece[]);

            clonedBoard.calculateAllMoves();

            return clonedBoard;
        })

        modalRef.current?.classList.add("hidden");
    }

    function promotionTeamType() {
        return (promotionPawn?.team === TeamType.OUR) ? "W" : "B";
    }

    function restartGame() {
        checkmateModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }

    return (
        <>
            <p style={{ color: "white", fontSize: "24px", textAlign: "center" }}>Total turns: {board.totalTurns}</p>
            <button onClick={runScript}>Run Python Script</button>
            <div className="modal hidden" ref={modalRef}>
                <div className="modal-body">
                    <img onClick={() => promotePawn(PieceType.ROOK)} src={`/Assets/Images/${promotionTeamType()}_Rook.png`} />
                    <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/Assets/Images/${promotionTeamType()}_Bishop.png`} />
                    <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/Assets/Images/${promotionTeamType()}_Knight.png`} />
                    <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/Assets/Images/${promotionTeamType()}_Queen.png`} />
                </div>
            </div>
            <div className="modal hidden" ref={checkmateModalRef}>
                <div className="modal-body">
                    <div className="checkmate-body">
                        <span>The winning team is {board.winningTeam === TeamType.OUR ? "white" : "black"}!</span>
                        <button onClick={restartGame}>Play again</button>
                    </div>
                </div>
            </div>
            <Chessboard playMove={playMove}
                pieces={board.pieces} />
        </>
    )
}

export default Referee;
