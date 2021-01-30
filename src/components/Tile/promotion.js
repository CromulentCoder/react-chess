import { connect } from "react-redux";
import cx from "classnames";

import { setNextSnapshot } from "../../redux/actions/game";
import PIECE_MAP from "../Pieces";
import css from "./tile.module.css";

const Promotion = (props) => {
    const {
        turn,
        code
    } = props;

    const className = cx({
        [css.popup]: true,
        [css.positionBottom]: turn === 'w',
        [css.positionTop]: turn === 'b'            
    })

    const QueenPiece = PIECE_MAP[turn + 'Q'];
    const BishopPiece = PIECE_MAP[turn + 'B'];
    const RookPiece = PIECE_MAP[turn + 'R'];
    const KnightPiece = PIECE_MAP[turn + 'N'];

    const handleClick = (e, pieceType) => {
        e.preventDefault();
        props.setNextSnapshot(code, turn + pieceType);
    }

    return (
        <div className= {className} >
            <QueenPiece onClick = {e => handleClick(e, 'Q')}/>
            <RookPiece onClick = {e => handleClick(e, 'R')}/>
            <BishopPiece onClick = {e => handleClick(e, 'B')}/>
            <KnightPiece onClick = {e => handleClick(e, 'N')}/>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {turn: state.game.present.turn}
}

const mapDispatchToProps = {
    setNextSnapshot
}

const ConnectedPromotion = connect(mapStateToProps, mapDispatchToProps)(Promotion);

export default ConnectedPromotion;