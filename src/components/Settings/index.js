import React from "react";
import { connect } from "react-redux";
import cx from "classnames";

import { reset } from "../../redux/actions/history";

import { ReactComponent as Bars } from "./svgs/bars.svg";
import css from './settings.module.css';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            reset: props.reset,
            isCollapsed: true
        }
    }

    toggleCollapse = (e) => {
        e.preventDefault();
        this.setState({
            isCollapsed: !this.state.isCollapsed
        })
        
    }

    handleClick = (e) => {
        e.preventDefault();
        this.state.reset();
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
                    <button onClick = {e => this.handleClick(e)} className = {css.button}>
                        Reset
                    </button>
                </div>  
            </div>
        )
    }
}

const ConnectedSettings = connect(
    null,
    { reset }
)(Settings)

export default ConnectedSettings;