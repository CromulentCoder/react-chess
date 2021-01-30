export default function codeToTile(code) {    
    const row = 8 - code.charAt(1);
    const col = code.charCodeAt(0) - 97;
    return {row, col}
}