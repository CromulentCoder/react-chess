export default function inbound(row, col) {
    return row >= 0 && col >= 0 && row < 8 && col < 8;
}