import React, { memo } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { setPromotionCode , setNextSelected, setNextSnapshot } from "../../redux/actions/game";

import css from './tile.module.css';
import ConnectedPromotion from "./promotion";

class Tile extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }   

    handleClick(e) {
        e.preventDefault();
        if (!this.props.promotionCode && this.props.selected && this.props.selected.charAt(1) === 'P' && this.props.selectedMoves.includes(this.props.code) && (this.props.code.charAt(1) === '8' || this.props.code.charAt(1) === '1')) {
            this.props.setPromotionCode(this.props.code);
        } else if (this.props.selected && !this.props.promotionCode && this.props.selectedMoves.includes(this.props.code)) {
            this.props.setNextSnapshot(this.props.code);
        } else if (this.props.piece && this.props.turn === this.props.piece.charAt(0) && !this.props.selected.includes(this.props.code)) {
            this.props.setNextSelected(this.props.piece, this.props.code);
        }
    }

    render() {
        const lastMoveTrail = this.props.lastMoveOrigin === this.props.code;
        const lastMove = this.props.lastMoveDestination === this.props.code;
        const isHighlighted = this.props.selectedMoves.includes(this.props.code);
        const checked = this.props.checkedByPieces > 0 && this.props.piece === this.props.turn + 'K';
        const isVisible = this.props.promotionCode === this.props.code;
        let divClass = cx({
            [css.tile]: true,
            [css.white]: this.props.backgroundColor,
            [css.black]: !this.props.backgroundColor,
            [css.selected]: this.props.selected.includes(this.props.code),
            [css.checked]: checked,
            [css.lastMove]: lastMove,
            [css.lastMoveTrail]: lastMoveTrail
        })

        let pieceDiv = cx({
            [css.ontop]: true,
        })
        let highlightedDivClass = cx({
            [css.hidden]: !isHighlighted,
            [css.show]: isHighlighted,
            [css.highlightedDiv]: !this.props.PieceComponent,
            [css.caputureable]: this.props.PieceComponent
        })
        return (
            <div className= { divClass } onClick = { this.handleClick } id ={this.props.code}>
                { this.props.PieceComponent ? <div className = { pieceDiv }>{ this.props.PieceComponent } </div> : "" }
                <div className = { highlightedDivClass } />
                {isVisible ? <ConnectedPromotion code = { this.props.code } /> : ""}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { game } = state;

    const { present } = game || [];

    const { turn, selected, selectedMoves, checkedByPieces, snapshot, promotionCode, snapshotMove } = present;

    let lastMoveOrigin;
    let lastMoveDestination;
    if (snapshotMove === "O-O" || snapshotMove === "O-O-O") {
        if (turn === 'w') {
            lastMoveOrigin = "e8";
            lastMoveDestination = snapshotMove === "O-O" ? "g8" : "c8";
        } else {
            lastMoveOrigin = "e1";
            lastMoveDestination = snapshotMove === "O-O" ? "g1" : "c1";
        }
    }
    else {
        lastMoveOrigin = snapshotMove?.substring(2, 4);
        lastMoveDestination = snapshotMove?.substring(4, 6);
    }
    

    return {
    turn,
    selected,
    selectedMoves,
    snapshot,
    checkedByPieces,
    promotionCode,
    lastMoveOrigin,
    lastMoveDestination
    }
}


const mapDispatchToProps = {
    setPromotionCode,
    setNextSelected, 
    setNextSnapshot
}

const ConnectedTile = connect(mapStateToProps, mapDispatchToProps)(memo(Tile));

export default ConnectedTile;