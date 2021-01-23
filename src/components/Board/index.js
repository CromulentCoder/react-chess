import { memo } from "react";
import { connect } from "react-redux";

import ConnectedRank from "../Rank"
import css from './board.module.css';

import { setNextMovableTiles } from "../../redux/actions/game";

const Board = (props) => {
    const {
        ranks,
        files,
    } = props;

    let backgroundColor = true;
    props.setNextMovableTiles();
    return (
        <div className= {css.container}>
            {ranks.map(rank => {
                const bg = backgroundColor;
                backgroundColor = !backgroundColor;
                return (
                    <ConnectedRank
                        key = {rank}
                        rankName = {rank}
                        files = {files}
                        backgroundColor = {bg}
                    />
                )
            })}
        </div>
    )
}

const mapStateToProps = (state) => {
    // const { isDoingMatch } = general
    // console.log(state);
    const { present } = state.game
    const { ranks, files } = present
    return {
        ranks,
        files
    }
};

const ConnectBoard = connect(
    mapStateToProps,
    { setNextMovableTiles }
)(memo(Board))

export default ConnectBoard;