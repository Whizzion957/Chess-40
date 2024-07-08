
export class ChessMove {
    piece: string;
    initialX: string;
    initialY: number;
    finalX: string;
    finalY: number;

    constructor(piece: string, initialX: string, initialY: number, finalX: string, finalY: number) {
        this.piece = 'king';
        this.initialX = 'a';
        this.initialY = 4;
        this.finalX = 'a';
        this.finalY = 3;
    }
}
