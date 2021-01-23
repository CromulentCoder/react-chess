import React, { memo } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { setNextSelected, setNextSnapshot, setNextCapturedSnapshot} from "../../redux/actions/game";

import './tile.css';

class Tile extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }   

    handleClick(e) {
        e.preventDefault();
        if (this.props.selected && this.props.selectedMoves.includes(this.props.code)) {
            this.props.setNextSnapshot(this.props.code);
        } else if (this.props.piece && this.props.turn === this.props.piece.charAt(0) && !this.props.selected.includes(this.props.code)) {
            this.props.setNextSelected(this.props.piece, this.props.code);
        }
    }

    render() {
        const isHighlighted = this.props.selectedMoves.includes(this.props.code);
        let divClass = cx({
            tile: true,
            white: this.props.backgroundColor,
            black: !this.props.backgroundColor,
            selected: this.props.selected.includes(this.props.code)
        })

        let pieceDiv = cx({
            ontop: true,
        })
        let highlightedDivClass = cx({
            hidden: !isHighlighted,
            show: isHighlighted,
            highlightedDiv: !this.props.PieceComponent,
            caputureable: this.props.PieceComponent
        })
        return (
            <div className= { divClass } onClick = { this.handleClick } id ={this.props.code}>
                <div className = { pieceDiv }>{ this.props.PieceComponent } </div>
                <div className = { highlightedDivClass } />
            </div>
        )
    }
}

const mapStateToProps = (props) => {
    
    const { present } = props.game;

    const { turn, selected, moves, selectedMoves, snapshot, checkBy, checkTo } = present;

    return {
    turn: turn,
    selected: selected,
    moves: moves,
    selectedMoves: selectedMoves,
    snapshot: snapshot,
    checkTo: checkTo,
    checkBy: checkBy,
    }
}


const mapDispatchToProps = {
    setNextSelected, 
    setNextSnapshot
}

const ConnectedTile = connect(mapStateToProps, mapDispatchToProps)(memo(Tile));

export default ConnectedTile;