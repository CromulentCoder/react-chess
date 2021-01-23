import { memo } from "react";
import { connect } from "react-redux";

import PIECE_MAP from "../svgs";
import ConnectedTile from "../Tile";
import css from './rank.module.css';

const Rank = (props) => {
    const {
        rankName,
        snapshot,
        files,        
    } = props;

    let { backgroundColor } = props;
    return (
        <div className= {css.container}>
            {files.map(file => {
                const code = file + rankName;
                const tilePos = (8 - rankName) + "" + files.indexOf(file);
                const index = snapshot.findIndex(element => element.includes(code));
                let piece = null;
                let PieceComponent = null;
                const bg = backgroundColor;
                backgroundColor = !backgroundColor;
                // console.log(index, code);
                if (index !== -1) {
                    const pieceColor = snapshot[index].substring(0,1);
                    const pieceType = snapshot[index].substring(1,2);
                    piece = pieceColor + pieceType;
                    const Piece = PIECE_MAP[piece];
                    PieceComponent = <Piece />
                }

                return (
                    <ConnectedTile
                        key = {code} 
                        tilePos = {tilePos}
                        code = {code}
                        piece = {piece}
                        backgroundColor = {bg}
                        PieceComponent = {PieceComponent}
                    />
                )
            })}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {snapshot: state.game.present.snapshot}
}

const ConnectedRank = connect(mapStateToProps)(memo(Rank));

export default ConnectedRank;