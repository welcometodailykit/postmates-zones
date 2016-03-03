# postmates-zones

A sample Node.js app that displays the Postmates zones on a map.

![Screenshot](/public/ss.png)

Click on a city or search by zip code.


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

    npm start

Open http://localhost:3000

This can easily be deployed on Heroku. Make sure you add the `POSTMATES_AUTH` environmental variable with `heroku config:add POSTMATES_AUTH='Basic [your auth token]'`.

## Docs

Read more on the [Postmates Developer Docs](https://postmates.com/developer/docs/endpoints#get_zones).

## Live Demo

You can see a working version of this on Heroku: [http://pmzones.herokuapp.com/](http://pmzones.herokuapp.com/)

## TODO

* Remove zip codes when searching for a new one
* Add label to zip code polygon
* Rewrite in React & Redux
