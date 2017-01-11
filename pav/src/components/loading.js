import React, { Component } from 'react';

export default class Loading extends Component {
    render() {
        return (
            <div className="loading container">
                <img src="/static/images/ripple.gif" />
            </div>
        );
    }
}
