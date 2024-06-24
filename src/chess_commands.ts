
export class ChessMove {
    piece: string;
    initialX: string;
    initialY: number;
    finalX: string;
    finalY: number;

    constructor(piece: string, initialX: string, initialY: number, finalX: string, finalY: number) {
        this.piece = 'bishop';
        this.initialX = 'a';
        this.initialY = 1;
        this.finalX = 'a';
        this.finalY = 2;
    }
}
