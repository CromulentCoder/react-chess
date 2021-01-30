import { memo } from "react";
import { connect } from "react-redux";

import ConnectedRank from "../Rank"
import {FILES, RANKS} from "../../constants";
import css from './board.module.css';

import { setNextMovableTiles } from "../../redux/actions/game";

const Board = (props) => {
    const ranks = RANKS;
    const files = FILES;

    let backgroundColor = true;
    props.setNextMovableTiles();
    return (
        <div className= {css.container}>
            {ranks.map(rank => {
                const bg = backgroundColor;
                backgroundColor = !backgroundColor;
                return <ConnectedRank
                        key = {rank}
                        rankName = {rank}
                        files = {files}
                        backgroundColor = {bg}
                    />
            })}
        </div>
    )
}

const ConnectBoard = connect(
    null,
    { setNextMovableTiles }
)(memo(Board))

export default ConnectBoard;