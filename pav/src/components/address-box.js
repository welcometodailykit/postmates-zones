import React, { Component } from 'react';
import Loading from './loading';
import { reduxForm } from 'redux-form';
import * as actions from '../actions';

class AddressBox extends Component {
    state = {
        isLoading: false
    };

    handleFormSubmit({ quotes }) {
        this.props.getQuotes({ quotes });
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
                            <label className="label">Enter a list of addresses, each on a new line:</label>
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
