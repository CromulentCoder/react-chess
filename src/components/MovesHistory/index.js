import { memo } from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { undoSnapshot, redoSnapshot, undoSnapshotByIndex, redoSnapshotByIndex } from "../../redux/actions/history";

import { ReactComponent as ArrowLeft } from "./svgs/arrowLeft.svg";
import { ReactComponent as ArrowRight } from "./svgs/arrowRight.svg";
import css from "./moves.module.css";

const MovesHistory = (props) => {

    const { moveList } = props;
    const handleClick = (e, key) => {
        e.preventDefault();
        const obj = moveList.find(move => move.key === key);
        if (obj.past !== undefined) {
            if (obj.past === true) props.undoSnapshotByIndex(obj.index);
            else props.redoSnapshotByIndex(obj.index);
        }
    }

    return (
        <div className = {css.container}>
            <p className = {css.heading}>Moves</p>
            <div className = {css.moves}>
                {moveList && moveList.map(item => {
                    const { snapshotMove, key, past } = item;
                    let className = cx({
                        [css.button] : true,
                        [css[item.moveClass]] : true,
                        [css.selectedMove] : past === undefined
                    });
                    if (snapshotMove) {
                        return (
                            <button key = {key} className = { className } onClick = {e => handleClick(e, key)}>{ snapshotMove }</button>
                        )
                    } else return null;
                })}
            </div>
            <div className = { css.arrows }>
                <button className = {css.arrow} onClick = {props.undoSnapshot} > <ArrowLeft /> </button>
                <button className = {css.arrow} onClick = {props.redoSnapshot} > <ArrowRight /> </button>
            </div>
        </div>
    )

}

const mapStateToProps = (state) => {
    const { game } = state;
    const { past, future, present } = game;
    let { snapshotMove : currMove, moves, checkedByPieces } = present;

    let pastMoveList = [];
    past.forEach( (obj, index) => {
        let { snapshotMove } = obj;
        if (snapshotMove.charAt(1) === 'P') {
            if (snapshotMove.indexOf('x') !== -1) snapshotMove = snapshotMove.charAt(2) + snapshotMove.substring(4);
            else snapshotMove = snapshotMove.substring(4);
        } else if (snapshotMove.charAt(0) !== 'O') snapshotMove = snapshotMove.charAt(1) + snapshotMove.substring(4);
        pastMoveList.push({
            index, snapshotMove, "past": true, key: index
        });
    });

    if (currMove.charAt(1) === 'P') {
        if (currMove.indexOf('x') !== -1) currMove = currMove.charAt(2) + currMove.substring(4);
        else currMove = currMove.substring(4);
    } else if (currMove.charAt(0) !== 'O') currMove = currMove.charAt(1) + currMove.substring(4);

    let futureMoveList = [];
    future.forEach( (obj, index) => {
        let { snapshotMove } = obj;
        if (snapshotMove.charAt(1) === 'P') {
            if (snapshotMove.indexOf('x') !== -1) snapshotMove = snapshotMove.charAt(1) + snapshotMove.substring(4);
            else snapshotMove = snapshotMove.substring(4);
        } else if (snapshotMove.charAt(0) !== 'O') snapshotMove = snapshotMove.charAt(1) + snapshotMove.substring(4);
        futureMoveList.push({
            index: index, snapshotMove, past: false, key: pastMoveList.length + 1 + index
        });
    });

    let moveList = [];
    moveList = [...pastMoveList, { index: -1, snapshotMove: currMove, key: pastMoveList.length }, ...futureMoveList];
    
    if (moves.length === 0 && checkedByPieces > 0) {
        let move = moveList[moveList.length - 1]["snapshotMove"];
        move = move.substring(0, move.length - 1) + "#";
        moveList[moveList.length - 1]["snapshotMove"] = move;
    }

    return {
        moveList
    }
}

const mapDispatchToProps = { 
    undoSnapshotByIndex,
    redoSnapshotByIndex,
    undoSnapshot,
    redoSnapshot 
}

const ConnectedMovesHistory = connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(MovesHistory))

export default ConnectedMovesHistory;