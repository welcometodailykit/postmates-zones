import axios from 'axios';
import {
    GET_QUOTES
} from './types';

const ROOT_URL = 'http://zones.postmates.com';


export function getQuotes(quotes, mode) {
    // New array with a single key and a list of addresses
    const addresses = {
        mode,
        data: quotes.quotes.split('\n')
    };

    return function(dispatch) {
        axios.post(`${ROOT_URL}/addresses`, addresses)
            .then((res) => {
                const response = {
                    data: formatResponse(addresses.data, res.data)
                }

                const action = {
                    type: GET_QUOTES,
                    payload: response
                };

                dispatch(action);
            })
            .catch((err) => {
                dispatch('Error, something went wrong.')
            });
    }
}

function formatResponse(names, values) {
    var result = [];

    for (var i = 0; i < names.length; i++) {
        var obj = {
            address: names[i],
            isInZone: values[i]['pointInPolygon'],
            zoneName: values[i]['zoneName']
        };
        result.push(obj);
    }

    return result;
}
