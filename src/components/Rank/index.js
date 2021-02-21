import { memo } from "react";
import { connect } from "react-redux";

import PIECE_MAP from "../Pieces";
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
        <>
        <div className= {css.container}>
            <div className = {css.row}>
                {props.coords ? <p>{rankName}</p> : ""}
                {files.map(file => {
                    const code = file + rankName;
                    const tilePos = (8 - rankName) + "" + files.indexOf(file);
                    const index = snapshot.findIndex(element => element.includes(code));
                    let piece = null;
                    let PieceComponent = null;
                    const bg = backgroundColor;
                    backgroundColor = !backgroundColor;
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
        </div>
        {props.coords && rankName === 1 ? 
            <div className = {css.container}>
                {files.map(file => <p key = {file} className = {css.file}>{file}</p>)}
            </div> : ""
        }
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        snapshot: state.game.present.snapshot,
        coords: state.settings.coords
    }
}

const ConnectedRank = connect(mapStateToProps)(memo(Rank));

export default ConnectedRank;