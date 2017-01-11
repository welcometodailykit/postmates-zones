import React, { Component } from 'react';
import CSV from './csv';
import { connect } from 'react-redux';
import * as actions from '../actions';

const COLUMNS = ['Address', 'In Zone?'];

class Results extends Component {
    renderQuotes() {
        /* `quotes` will be an array of returned quote objects:
        {
            quotes: [
                {
                    "address": "425 Market St, SF, CA",
                    "isInZone": true
                }, ...
            ]
        }
        */
        return (
            <section className="section results">
                <h3 className="title is-3">Results</h3>
                <table className="table">
                    <thead>
                        <tr>
                            { COLUMNS.map((col, i) => <th key={ i }>{ col }</th>) }
                        </tr>
                    </thead>
                    <tbody>
                        { this.props.quotes.data.map((quote, index) => {
                            return (
                                <tr key={ index }>
                                    <td>{ quote.address }</td>
                                    <td>{ quote.isInZone.toString() }</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <CSV
                    header={ COLUMNS }
                    data={ this.props.quotes.data } />
            </section>
        );
    }

    render() {
        return (
            <div>
                { this.props.quotes.data ? this.renderQuotes() : null }
            </div>
        );
    }
}

function mapStateToProps({ quotes }) {
    return { quotes };
}

export default connect(mapStateToProps)(Results);
