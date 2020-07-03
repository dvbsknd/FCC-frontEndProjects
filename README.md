## Overview

This is the repo for a set of [freeCodeCamp exercises](https://www.freecodecamp.org/learn/front-end-libraries/front-end-libraries-projects/) that I decided to set-up with a stand-alone NodeJS webserver so that I could get a bit of practice with the server-side environment while completing the various front-end challenges.

There's a stand-alone [test script](https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js) supplied by freeCodeCamp which needs to be added to each challenge's HTML page—this is what determines whether the challenge is successfully completed or not.

## Stack & infrastructure

The server is a simple, raw [NodeJS](https://nodejs.org/) implementation serving the static files found in the `/challenges` directory. `yarn` or `npm` can be used for package management, but I have used `npm` just to minimise the number of tools and dependencies. I have installed `nodemon` as a dev. dependency to get the benefit of hot-reloading and this is run via the `npm start` script using `npx` so that it doesn't need to be installed globally.

The server sets correct `Content-Type` headers for `css`, `js` and `html` files, and if others are required (such as images) they'll be added along the way.

## Local development

Should you wish to fork and play you should simply be able to:

```sh
git clone https://github.com/dvbsknd/freeCodeCamp-frontEndProjects.git
cd freeCodeCamp-frontEndProjects
npm install
npm start
```

And then browse to http://localhost:3000/.
