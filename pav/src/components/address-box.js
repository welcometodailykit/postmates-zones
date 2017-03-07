import React, { Component } from 'react';
import Loading from './loading';
import { reduxForm } from 'redux-form';
import * as actions from '../actions';

class AddressBox extends Component {
    state = {
        isLoading: false,
        mode: 'addresses'
    };

    handleFormSubmit({ quotes }) {
        this.props.getQuotes({ quotes }, this.state.mode);
    }

    toggleMode() {
        this.setState({
            mode: this.state.mode === 'addresses' ? 'coordinates' : 'addresses'
        })
    }

    render() {
        const { handleSubmit, submitting, fields: { quotes }} = this.props;

        return (
            <div className="address-box">
                <section className="section heading">
                    <div className="container">
                        <h1 className="title is-1">Postmates Zone Check</h1>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <form onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                            <label className="label">Enter a list of addresses, each on a new line. Be sure to remove extra address information like suite/unit numbers and other "address 2" fields:</label>
                            <p className="control radio">
                                <span>
                                    <input
                                        type="radio"
                                        name="mode"
                                        id="mode-addresses"
                                        value="addresses"
                                        checked={ this.state.mode == 'addresses' }
                                        onClick={ () => this.toggleMode() } />
                                    <label htmlFor="mode-addresses">Addresses</label>
                                </span>
                                <span>
                                    <input
                                        type="radio"
                                        name="mode"
                                        id="mode-coordinates"
                                        value="coordinates"
                                        checked={ this.state.mode == 'coordinates' }
                                        onClick={ () => this.toggleMode() } />
                                    <label htmlFor="mode-coordinates">Coordinates</label>
                                </span>
                            </p>
                            <p className="control">
                                <textarea
                                    { ...quotes }
                                    className="textarea"
                                    value={ quotes.value || '' }
                                    placeholder="Please limit each query to 1000 lines or less" />
                            </p>
                            <button className="button is-primary" type="submit">Validate</button>
                        </form>
                    </div>
                </section>
                { this.state.isLoading ? <Loading /> : null }
            </div>
        );
    }
}

export default reduxForm({
    form: 'quotes',
    fields: ['quotes']
}, null, actions)(AddressBox)
