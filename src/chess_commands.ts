
export class ChessMove {
    piece: string;
    initialX: string;
    initialY: number;
    finalX: string;
    finalY: number;

    constructor(piece: string, initialX: string, initialY: number, finalX: string, finalY: number) {
        this.piece = 'queen';
        this.initialX = 'a';
        this.initialY = 1;
        this.finalX = 's';
        this.finalY = 2;
    }
}
