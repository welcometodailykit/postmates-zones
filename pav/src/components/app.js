import React, { Component } from 'react';

import AddressBox from './address-box';
import Results from './results';

export default class App extends Component {
    render() {
        return (
            <div className="container">
                <AddressBox />
                <Results />
            </div>
        );
    }
}
