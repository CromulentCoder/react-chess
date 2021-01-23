export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const RANKS = [8,7,6,5,4,3,2,1];

export const SIDE_TO_COLOR_CODE = {
    White : "w",
    Black : "b",
}

export const COLOR_CODE_TO_SIDE = {
    w : "White",
    b : "Black"
}

export const PIECE_NAME_TO_CODE = {
    King : "K",
    Queen : "Q",
    Bishop : "B",
    Knight : "N",
    Rook : "R",
    Pawn : "P"
}

export const PIECE_CODE_TO_NAME = {
    K : "King",
    Q : "Queen",
    B : "Bishop",
    N : "Knight",
    R : "Rook",
    P : "Pawn"
}

export const INITIAL_POSITION = {
    wR : ['a1', 'h1'],
    wN : ['b1', 'g1'],
    wB : ['c1', 'f1'],
    wQ : ['d1'],
    wK : ['e1'],
    wP : ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
    bR : ['a8', 'h8'],
    bN : ['b8', 'g8'],
    bB : ['c8', 'f8'],
    bQ : ['d8'],
    bK : ['e8'],
    bP : ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7']
}

export const MOVEMENTS = {
    B: {
        DOWNRIGHT: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
        UPRIGHT: [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
        DOWNLEFT: [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
        UPLEFT: [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]]
    },
    K: [
        [0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]
    ],
    N: [
        [-1, -2], [-1, 2], [1, -2], [1, 2], [-2, -1], [-2, 1], [2, -1], [2, 1]
    ],  
    P: [
        [1, 0]
    ],
    Q: {
        RIGHT: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        LEFT: [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]],
        DOWN: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
        UP: [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
        DOWNRIGHT: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
        UPRIGHT: [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
        DOWNLEFT: [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
        UPLEFT: [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]]
    },
    R: {
        RIGHT: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
        LEFT: [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]],
        DOWN: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
        UP: [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]]
    }
}

export const SPECIAL_MOVES = {
    K: ['shortCastle', 'longCastle'],
    P: ['doubleStep', 'enPassant']
}

export const SPECIAL_MOVEMENTS = {
    shortCastle : {
        K : [[0, 2]],
        R : [[0, -2]]
    },
    longCastle : {
        K : [[0, -2]],
        R : [[0, 3]]
    },
    doubleStep : {
        P : [[2, 0]]
    },
    enPassant : {
        P : [[1, -1], [1, 1]]
    }
}