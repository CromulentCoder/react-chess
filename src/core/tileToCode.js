import {RANKS, FILES } from "../constants";

export default function tileToCode(row, col) {
    const rank = RANKS[row];
    const file = FILES[col];
    return file+rank;
}