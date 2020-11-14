import React, { Fragment } from 'react';
import './Components.css'

export const Overlay = props => (
    <Fragment>
        <div className="overlay" onClick={props.bgClick} style={{ opacity: (props.visible === true ? 1 : 0), display: (props.visible === true ? 'block' : 'none') }}></div>
        <div className="overlay-container" style={{ display: (props.visible === true ? 'block' : 'none') }}>
            {props.children}
        </div>
    </Fragment>
)
