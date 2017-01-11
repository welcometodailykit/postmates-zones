import React, { Component } from 'react';
import FileSaver from 'file-saver';

export default class CSV extends Component {
    static propTypes = {
        header: React.PropTypes.array,
        data: React.PropTypes.array
    };

    download(header, data) {
        let csv = '';

        if (!data.length) {
            return;
        }

        if (header) {
            csv = header.join() + '\r\n';
        }

        csv += data.map((obj) => {
            obj.address = `"${obj.address}"`;
            const row = Object.values(obj).join();
            return `${row}\r\n`;
        });

        const blob = new Blob([ '\ufeff', csv ], {
            type: 'application/octet-stream'
        });

        FileSaver.saveAs(blob, 'addresses.csv');
    }

    render() {
        const {
            header,
            data
        } = this.props;

        return (
            <button className="button is-primary"
                onClick={ () => this.download(header, data) }>
                Download CSV
            </button>
        );
    }
}
