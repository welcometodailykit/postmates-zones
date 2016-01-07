# postmates-zones

A sample Node.js app that displays the Postmates zones on a map.

![Screenshot](/public/ss.png)


## Installation

Make sure git and Node.js are installed:

    brew install node git

Clone the repo and install dependencies:

    git clone git@github.com:postmates/postmates-zones.git
    npm i

Update environmental variable with Postmates auth header. Base64-encode [your API key](https://postmates.com/developer/apikey):

    export POSTMATES_AUTH='Basic Y2YyZjJkNmQtYTM___SECRET___M2MwYWYzMTY1Og=='

Update your Mapbox token in [index.ejs](views/index.ejs#L24).

## Usage

Run locally:

    node app.js

Open http://localhost:5000

This can easily be deployed on Heroku. Make sure you add the `POSTMATES_AUTH` environmental variable with `heroku config:add POSTMATES_AUTH='Basic [your auth token]'`.

## Docs

Read more on the [Postmates Developer Docs](https://postmates.com/developer/docs/endpoints#get_zones).
