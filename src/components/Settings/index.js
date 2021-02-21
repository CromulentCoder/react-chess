import React from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { reset, toggleCoordinates } from "../../redux/actions/settings";

import { ReactComponent as Bars } from "./svgs/bars.svg";
import css from './settings.module.css';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            reset: props.reset,
            toggleCoordinates: props.toggleCoordinates,
            isCollapsed: true
        }
    }

    toggleCollapse = (e) => {
        e.preventDefault();
        this.setState({
            isCollapsed: !this.state.isCollapsed
        })
        
    }

    handleClickReset = (e) => {
        e.preventDefault();
        this.state.reset();
    }

    handleClickCoords = (e) => {
        e.preventDefault();
        this.state.toggleCoordinates();
    }

    render = () => {
        return (
            <div className = {cx({[css.container]: true})}>
                <Bars className = {cx({
                    [css.bars]: true
                })} onClick = {e => this.toggleCollapse(e) }/>
                <div className = {cx({
                    [css.collapsed]: this.state.isCollapsed,
                    [css.items]: true
                })}>
                    <p className = {css.heading}> Settings </p>
                    <button onClick = {e => this.handleClickReset(e)} className = {css.button}>
                        Reset
                    </button>
                    <button onClick = {e => this.handleClickCoords(e)} className = {css.button}>
                        Toggle Coordinates
                    </button>
                </div>  
            </div>
        )
    }
}

const ConnectedSettings = connect(
    null,
    { reset,
    toggleCoordinates }
)(Settings)

export default ConnectedSettings;