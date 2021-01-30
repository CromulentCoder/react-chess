import { connect } from "react-redux";

import { reset } from "../../redux/actions/history";

import css from './settings.module.css';

const Settings = (props) => {
    
    const handleClick = (e) => {
        e.preventDefault();
        props.reset();
    }

    return (
        <div className= {css.container}>
            <p className = {css.heading}> Settings </p>
            <button onClick = {e => handleClick(e)} className = {css.button}>
                Reset
            </button>
        </div>
    )
}

const ConnectedSettings = connect(
    null,
    { reset }
)(Settings)

export default ConnectedSettings;