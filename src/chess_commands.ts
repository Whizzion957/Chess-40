
export class ChessMove {
    piece: string;
    initialX: string;
    initialY: number;
    finalX: string;
    finalY: number;

    constructor(piece: string, initialX: string, initialY: number, finalX: string, finalY: number) {
        this.piece = "king";
        this.initialX = "h";
        this.initialY = 1;
        this.finalX = "h";
        this.finalY = 2;
    }
}
