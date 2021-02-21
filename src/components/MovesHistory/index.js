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
    let { snapshotMove : currSnapshotMove, moves, checkedByPieces : currCheckedByPieces, captured: currCaptured } = present;

    let pastMoveList = [];
    past.forEach( (pastState, index) => {
        let { snapshotMove, captured, checkedByPieces } = pastState;
        if (snapshotMove.charAt(1) === 'P') {
            snapshotMove = snapshotMove.substring(2);
            if (captured) snapshotMove = snapshotMove.slice(0, 2) + 'x' + snapshotMove.slice(2);
        } else if (snapshotMove !== "O-O" && snapshotMove !== "O-O-O") {
            snapshotMove = snapshotMove.slice(1, 2) + snapshotMove.slice(4, 6);
            if (captured) snapshotMove = snapshotMove.slice(0, 1) + 'x' + snapshotMove.slice(1, 3);
        }
        if (checkedByPieces > 0) snapshotMove += '+';
        pastMoveList.push({
            index, snapshotMove, "past": true, key: index
        });
    });

    if (currSnapshotMove.charAt(1) === 'P') {
        currSnapshotMove = currSnapshotMove.substring(2);
        if (currCaptured) currSnapshotMove = currSnapshotMove.slice(0, 2) + 'x' + currSnapshotMove.slice(2);
    } else if (currSnapshotMove !== "O-O" && currSnapshotMove !== "O-O-O") {
        currSnapshotMove = currSnapshotMove.slice(1, 2) + currSnapshotMove.slice(4, 6);
        if (currCaptured) currSnapshotMove = currSnapshotMove.slice(0, 1) + 'x' + currSnapshotMove.slice(1, 3);
    }
    if (currCheckedByPieces > 0) currSnapshotMove += '+';

    let futureMoveList = [];
    future.forEach( (futureState, index) => {
        let { snapshotMove, captured, checkedByPieces } = futureState;
        if (snapshotMove.charAt(1) === 'P') {
            snapshotMove = snapshotMove.substring(2);
            if (captured) snapshotMove = snapshotMove.slice(0, 2) + 'x' + snapshotMove.slice(2);
        } else if (snapshotMove !== "O-O" && snapshotMove !== "O-O-O") {
            snapshotMove = snapshotMove.slice(1, 2) + snapshotMove.slice(4, 6);
            if (captured) snapshotMove = snapshotMove.slice(0, 1) + 'x' + snapshotMove.slice(1, 3);
        }
        if (checkedByPieces > 0) snapshotMove += '+';
        futureMoveList.push({
            index: index, snapshotMove, past: false, key: pastMoveList.length + 1 + index
        });
    });

    let moveList = [];
    moveList = [...pastMoveList, { index: -1, snapshotMove: currSnapshotMove, key: pastMoveList.length }, ...futureMoveList];
    
    if (moves.length === 0 && currCheckedByPieces > 0) {
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