import React from "react";

import { ReactComponent as BBishop } from "./svgs/blackBishop.svg";
import { ReactComponent as BKing } from "./svgs/blackKing.svg";
import { ReactComponent as BKnight } from "./svgs/blackKnight.svg";
import { ReactComponent as BPawn } from "./svgs/blackPawn.svg";
import { ReactComponent as BQueen } from "./svgs/blackQueen.svg";
import { ReactComponent as BRook } from "./svgs/blackRook.svg";

import { ReactComponent as WBishop } from "./svgs/whiteBishop.svg";
import { ReactComponent as WKing } from "./svgs/whiteKing.svg";
import { ReactComponent as WKnight } from "./svgs/whiteKnight.svg";
import { ReactComponent as WPawn } from "./svgs/whitePawn.svg";
import { ReactComponent as WQueen } from "./svgs/whiteQueen.svg";
import { ReactComponent as WRook } from "./svgs/whiteRook.svg";


class Pieces extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: props.board,
            col : props.col,
            row : props.row,
            chessCoordinate: props.chessCoordinate,
            color: props.color,
            canMove: props.canMove,
            isSelected: false,
            typeOfPiece: "",
            points: "",
            moveCounter: 0,
            handleMove: props.handleMove,
            validMoves: []
        }
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        let validMoves = this.getValidMoves();
        this.setState({
            isSelected: true
        });
        if (this.state.canMove) {
            let board = this.state.board;
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j].indexOf('/') !== -1) {
                        board[i][j] = board[i][j].replace('/', '');
                        console.log(i, j, board[i][j]);
                    }
                }
            }
            for (let i = 0; i < validMoves.length; i++) {
                let r = validMoves[i][0]
                let c = validMoves[i][1];
                board[r][c] += '/';
            }
            this.setState(state => ({
                ...state,
                board : board
            }));
            console.log(board);
            console.log(this.state.board);
            this.state.handleMove(board);
        }
        console.log(this.state);
        console.log(validMoves);
    }


    makeMove() {
        if (this.state.isSelected) {
            
        }
    }

    setPosition(row, col, chessCordinate) {
        this.setState({
            col : col,
            row : row,
            chessCordinate: chessCordinate,
            validMoves: [],
            moveCounter: this.state.moveCounter + 1
        })
    }

    isValidSquare(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    getValidMoves() {

    }

    getDiagonalMoves(row, col) {
        if (!this.isValidSquare(row, col)) return
        if (this.state.board[row][col] !== ".") {
            let pieceColor = this.state.board[row][col].charAt(0) === 'W' ? "white" : "black";
            if (pieceColor !== this.state.color) this.state.validMoves.push([row, col]);
            return;
        }
        this.state.validMoves.push([row, col]);
        this.getDiagonalMoves(row - 1, col - 1);
        this.getDiagonalMoves(row - 1, col + 1);
        this.getDiagonalMoves(row + 1, col + 1);
        this.getDiagonalMoves(row + 1, col - 1);
    }

    getHorizontalMoves(row, col) {
        if (!this.isValidSquare(row, col)) return;
        if (this.state.board[row][col] !== ".") {
            let pieceColor = this.state.board[row][col].charAt(0) === 'W' ? "white" : "black";
            if (pieceColor !== this.state.color) this.state.validMoves.push([row, col]);
            return;
        }
        this.state.validMoves.push([row, col]);
        this.getHorizontalMoves(row, col - 1);
        this.getHorizontalMoves(row, col + 1);
    }

    getVerticalMoves(row, col) {
        if (!this.isValidSquare(row, col)) return;
        if (this.state.board[row][col] !== ".") {
            let pieceColor = this.state.board[row][col].charAt(0) === 'W' ? "white" : "black";
            if (pieceColor !== this.state.color) this.state.validMoves.push([row, col]);
            return;
        }
        this.state.validMoves.push([row, col]);
        this.getVerticalMoves(row - 1, col);
        this.getVerticalMoves(row + 1, col);
    }
}

class King extends Pieces {
    constructor(props) {
        super(props);
        this.state = {...this.state,
            typeOfPiece: "King",
            points: "1000",
        }
    }

    getValidMoves() {
        let row = this.state.row;
        let col = this.state.col;
        for (let r = row - 1; r <= row + 1; r++) {
            if (r < 0 || r > 7) continue;
            for (let c = col - 1; c <= col + 1; col++) {
                if (c < 0 || c > 7) continue;
                // To do: Add method to validate for possible checks
                if (this.state.board[r][c] === ".") this.state.validMoves.push([r, c]);
            }
        }
        return this.state.validMoves;
    }
}

export class WhiteKing extends King {
    render() {
        return <WKing />;
    }
}

export class BlackKing extends King {
    render() {
        return <BKing />;
    }
}

class Queen extends Pieces {
    constructor(props) {
        super(props);
        this.state = {...this.state,
            typeOfPiece: "Queen",
            points: "9",
        }
    }

    getValidMoves() {
        let row = this.state.row;
        let col = this.state.col;
        this.getDiagonalMoves(row, col);
        this.getVerticalMoves(row, col);
        this.getHorizontalMoves(row, col);
        return this.state.validMoves;
    }
}


export class WhiteQueen extends Queen {
    render() {
        return <WQueen />;
    }
}

export class BlackQueen extends Queen {
    render() {
        return <BQueen />;
    }
}

class Bishop extends Pieces {
    constructor(props) {
        super(props);
        this.state = {...this.state,
            typeOfPiece: "Bishop",
            points: "3",
        }
    }

    getValidMoves() {
        let row = this.state.row;
        let col = this.state.col;
        this.getDiagonalMoves(row, col);
        return this.state.validMoves;
    }
}


export class WhiteBishop extends Bishop {
    render() {
        return <WBishop />;
    }
}

export class BlackBishop extends Bishop {
    render() {
        return <BBishop />;
    }
}

class Knight extends Pieces {
    constructor(props) {
        super(props);
        this.state = {...this.state,
            typeOfPiece: "Knight",
            points: "3",
        }
    }

    getValidMoves() {
        let row = this.state.row;
        let col = this.state.col;
        
        for (let r = row - 2; r <= row + 2; r += 4) {
            if (r < 0 || r > 7) continue;
            for (let c = col - 1; c <= col + 1; c += 2) {
                if (c < 0 || c > 7) continue;
                let pieceColor = this.state.board[row][col].charAt(0) === 'W' ? "white" : "black";
                if (this.state.board[r][c] === "." || pieceColor !== this.state.color) this.state.validMoves.push([r, c]);
            }
        }

        for (let r = row - 1; r <= row + 1; r += 2) {
            if (r < 0 || r > 7) continue;
            for (let c = col - 2; c <= col + 2; c += 4) {
                if (c < 0 || c > 7) continue;
                let pieceColor = this.state.board[row][col].charAt(0) === 'W' ? "white" : "black";
                if (this.state.board[r][c] === "." || pieceColor !== this.state.color) this.state.validMoves.push([r, c]);
            }
        }

        return this.state.validMoves;
    }
}

export class WhiteKnight extends Knight {
    render() {
        return <WKnight />;
    }
}

export class BlackKnight extends Knight{
    render() {
        return <BKnight />;
    }
}

class Rook extends Pieces {
    constructor(props) {
        super(props);
        this.state = {...this.state,
            typeOfPiece: "Rook",
            points: "5",
        }
    }

    getValidMoves() {
        let row = this.state.row;
        let col = this.state.col;
        this.getVerticalMoves(row, col);
        this.getHorizontalMoves(row, col);
        return this.state.validMoves;
    }
}

export class WhiteRook extends Rook {
    render() {
        return <WRook />;
    }
}

export class BlackRook extends Rook {
    render() {
        return <BRook />;
    }
}

class Pawn extends Pieces {
    constructor(props) {
        super(props);
        this.state = {...this.state,
            typeOfPiece: "Pawn",
            points: "1",
        }
    }

    promotion() {
        // TO DO
        // if (this.moveCounter === 6) {
        //     let selection;
        //     // Show dropdown to select piece & add that piece
        //     this.state.board[this.state.row][this.state.col] = <Queen 
        //         col={this.state.col}
        //         row = {this.state.row} 
        //         chessCoordinate = {this.state.chessCoordinate}
        //         color = {this.state.color} />
        // }
    }
}

export class WhitePawn extends Pawn {
    getValidMoves() {
        this.setState({
            validMoves: []
        });
        let row = this.state.row;
        let col = this.state.col;
        this.promotion();
        if (this.state.moveCounter === 0) {
            if (this.state.board[row - 1][col] === "." && this.state.board[row - 2][col] === ".") this.state.validMoves.push([row - 2, col, 2])
        }
        if (this.state.moveCounter === 3) {
            if (this.state.board.lastMove === `P${row}${col - 1}`) this.state.validMoves.push([row - 1, col - 1], 1);
            if (this.state.board.lastMove === `P${row}${col + 1}`) this.state.validMoves.push([row - 1, col + 1], 1);
        }
        if (this.state.board[row - 1][col] === ".") this.state.validMoves.push([row - 1, col, 1]);
        return this.state.validMoves;
    }

    render() {
        return <WPawn />;
    }
}

export class BlackPawn extends Pawn {
    getValidMoves() {
        let row = this.state.row;
        let col = this.state.col;
        this.promotion();
        if (this.state.moveCounter === 0) {
            if (this.state.board[row + 1][col] === "." && this.state.board[row + 2][col] === ".") this.state.validMoves.push([row + 2, col, 2])
        }
        if (this.state.moveCounter === 3) {
            if (this.state.board.getlastMove() === `P${row}${col - 1}`) this.state.validMoves.push([row + 1, col - 1], 1);
            if (this.state.board.getlastMove() === `P${row}${col + 1}`) this.state.validMoves.push([row + 1, col + 1], 1);
        }
        if (this.state.board[row + 1][col] === ".") this.state.validMoves.push([row + 1, col, 1]);
        return this.state.validMoves;
    }

    render() {
        return <BPawn />
    }
}
